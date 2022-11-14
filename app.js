const express = require("express");
const app = express();
const { getTopics } = require("./controllers/controllers.js");

app.get("/api/topics", getTopics);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route not found!" });
});

module.exports = app;
