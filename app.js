const express = require("express");
const app = express();
const cors = require("cors");
const { getUsers, postUser } = require("./controllers/users.controllers");
const { getEndpoints } = require("./controllers/index.js");
const { getToilets, postToilet } = require("./controllers/toilets.controllers");
const {
  getReviews,
  getReviewsByToilet,
  postReviewByToilet,
} = require("./controllers/reviews.controllers");

app.use(cors());
app.use(express.json());

app.get("/api/healthy", (req, res) => {
  res.status(200).send({ msg: "server up and running!" });
});

app.get("/api/", getEndpoints);
app.get("/api/toilets", getToilets);
app.get("/api/users", getUsers);
app.get("/api/reviews", getReviews);
app.get("/api/toilets/:toilet_id/reviews", getReviewsByToilet);

app.post("/api/toilets", postToilet);
app.post("/api/users", postUser);
app.post("/api/toilets/:toilet_id/reviews", postReviewByToilet);

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
