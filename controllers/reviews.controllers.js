const {
  selectReviews,
  fetchReviewsByToiletId,
  insertReviewByToiletId,
} = require("../models/reviews.models");

exports.getReviews = (req, res, next) => {
  selectReviews().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getReviewsByToilet = (req, res, next) => {
  const { toilet_id } = req.params;
  fetchReviewsByToiletId(toilet_id)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postReviewByToilet = (req, res, next) => {
  const newReview = req.body;
  const toiletId = req.params.toilet_id;
  newReview.toilet_id = toiletId;
  insertReviewByToiletId(newReview)
    .then((review) => {
      res.status(201).send({ review });
    })
    .catch(next);
};
