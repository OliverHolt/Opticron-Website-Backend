const {
  selectArticles,
  selectSpecialOffers,
  selectCategories,
} = require("../models/models.js");

exports.getArticles = (req, res, next) => {
  selectArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getSpecialOffers = (req, res, next) => {
  selectSpecialOffers().then((specialOffers) => {
    res.status(200).send({ specialOffers });
  });
};

exports.getCategories = (req, res, next) => {
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};
