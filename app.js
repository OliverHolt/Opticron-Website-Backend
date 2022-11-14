const express = require("express");
const app = express();
const { getTopics } = require("./controllers/controllers.js");

app.use(express.json());

app.get("/api/topics", getTopics);

app.all("*", (req, res) => {
  res.status(400).send({ msg: "route not found" });
});

module.exports = app;
