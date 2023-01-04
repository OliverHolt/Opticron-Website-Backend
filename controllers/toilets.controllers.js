const { selectToilets, insertToilet } = require("../models/toilets.models");

exports.getToilets = (req, res, next) => {
  selectToilets().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.postToilet = (req, res, next) => {
  const newToilet = req.body;
  insertToilet(newToilet)
    .then((toilet) => {
      res.status(201).send({ toilet });
    })
    .catch((err) => {
      console.log(err);
    });
};
