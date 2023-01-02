const { selectToilets } = require("../models/toilets.models");

exports.getToilets = (req, res, next) => {
  selectToilets().then((topics) => {
    res.status(200).send({ topics });
  });
};
