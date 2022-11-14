const express = require("express");
const app = express();
const { getTopics, getArticles } = require("./controllers/controllers.js");

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route not found!" });
});

module.exports = app;
