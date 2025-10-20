const express = require("express");
const cors = require("cors");
const { default: axios } = require("axios");
const app = express();

// json body parser middleware, parses application/json
app.use(express.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.status(200).send(posts);
});

// function to handle different event types
const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { postId, title } = data;
    posts[postId] = {
      postId,
      title,
      comments: [],
    };
  }

  if (type === "CommentCreated") {
    const { commentId, content, postId, status } = data;
    posts[postId].comments.push({
      commentId,
      content,
      status,
    });
  }

  if (type === "CommentUpdated") {
    const { commentId, postId, status } = data;

    const post = posts[postId];
    const comment = post.comments.find(
      (comment) => comment.commentId === commentId
    );

    comment.status = status;
  }
};

// listening for events from event bus
app.post("/events", (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({});
});

app.listen(4002, async () => {
  console.log("Listening on 4002");

  // fetch all events from event bus to sync up, cluster-internal service name
  try {
    const { data } = await axios.get("http://event-bus-srv:4005/events");

    for (let event of data) {
      console.log("Processing event:", event.type);
      // process event
      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
});
