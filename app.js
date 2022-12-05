const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticle,
} = require("./controllers/articles.controllers");
const { getUsers } = require("./controllers/users.controllers");
const { deleteCommentById } = require("./controllers/comments.controllers.js");
const { getEndpoints } = require("./controllers/index.js");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/api/healthCheck", (req, res) => {
  res.status(200).send({ msg: "server up and running!" });
});

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/users", getUsers);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticle);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route not found!" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Not found!" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "server error!" });
});

module.exports = app;
