const express = require("express");
const app = express();
const cors = require("cors");
const { getEndpoints } = require("./controllers/index.js");
const {
  getArticles,
  getSpecialOffers,
  getCategories,
} = require("./controllers/controllers");

app.use(cors());
app.use(express.json());

app.get("/api/healthy", (req, res) => {
  res.status(200).send({ msg: "server up and running!" });
});

app.get("/api/", getEndpoints);
app.get("/api/articles", getArticles);
app.get("/api/specialoffers", getSpecialOffers);
app.get("/api/categories", getCategories);

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
