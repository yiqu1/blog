const express = require("express");
const cors = require("cors");
const { default: axios } = require("axios");
const { randomBytes } = require("crypto");
const app = express();

// json body parser middleware, parses application/json
app.use(express.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts/create", async (req, res) => {
  const postId = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[postId] = {
    postId,
    title,
  };

  // emit event to event bus, cluster-internal service name
  await axios.post("http://event-bus-srv:4005/events", {
    type: "PostCreated",
    data: {
      postId,
      title,
    },
  });

  res.status(201).send(posts[postId]);
});

// listening for events from event bus
app.post("/events", (req, res) => {
  console.log("Received Event", req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log("v55");
  console.log("Listening on 4000");
});
