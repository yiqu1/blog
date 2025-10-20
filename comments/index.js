const express = require("express");
const cors = require("cors");
const { default: axios } = require("axios");
const { randomBytes } = require("crypto");
const app = express();

// json body parser middleware, parses application/json
app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:postId/comments", (req, res) => {
  const comments = commentsByPostId[req.params.postId] || [];

  res.status(200).send(comments);
});

app.post("/posts/:postId/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.postId] || [];
  comments.push({ commentId, content, status: "pending" });
  commentsByPostId[req.params.postId] = comments;

  // emit event to event bus, cluster-internal service name
  await axios.post("http://event-bus-srv:4005/events", {
    type: "CommentCreated",
    data: {
      commentId,
      content,
      postId: req.params.postId,
      status: "pending",
    },
  });

  res.status(201).send(comments);
});

// listening for events from event bus
app.post("/events", async (req, res) => {
  console.log("Received Event", req.body.type);

  const {
    type,
    data: { postId, commentId, status, content },
  } = req.body;

  if (type === "CommentModerated") {
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.commentId === commentId);
    comment.status = status;

    // emit event to event bus, cluster-internal service name
    await axios
      .post("http://event-bus-srv:4005/events", {
        type: "CommentUpdated",
        data: {
          commentId,
          content,
          postId,
          status: comment.status,
        },
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
