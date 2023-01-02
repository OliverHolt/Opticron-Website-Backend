const { selectReviews } = require("../models/reviews.models");

exports.getReviews = (req, res, next) => {
  selectReviews().then((topics) => {
    res.status(200).send({ topics });
  });
};
