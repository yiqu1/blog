const express = require("express");
const { default: axios } = require("axios");
const app = express();

// json body parser middleware, parses application/json
app.use(express.json());

// store events in memory to sync new services
const events = [];

// receive events from other services and broadcast to all services
app.post("/events", (req, res) => {
  const event = req.body;

  // store event, most recent event at the end of the array
  events.push(event);

  // to posts service, using posts pod cluster IP service address
  axios.post("http://posts-clusterip-srv:4000/events", event).catch((err) => {
    console.log(err.message);
  });

  // to comments service
  axios.post("http://comments-srv:4001/events", event).catch((err) => {
    console.log(err.message);
  });

  // to query service
  axios.post("http://query-srv:4002/events", event).catch((err) => {
    console.log(err.message);
  });

  // to moderation service
  axios.post("http://moderation-srv:4003/events", event).catch((err) => {
    console.log(err.message);
  });

  res.send({ status: "OK" });
});

// endpoint to fetch all events for new services
app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log("Listening on 4005");
});
