const express = require("express");
const { default: axios } = require("axios");
const app = express();

// json body parser middleware, parses application/json
app.use(express.json());

// listening for events from event bus
app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved";

    // emit CommentModerated event to event bus, cluster-internal service name
    await axios
      .post("http://event-bus-srv:4005/events", {
        type: "CommentModerated",
        data: {
          commentId: data.commentId,
          content: data.content,
          postId: data.postId,
          status,
        },
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  res.send({});
});

app.listen(4003, () => {
  console.log("Listening on 4003");
});
