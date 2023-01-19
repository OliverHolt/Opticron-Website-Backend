const db = require("../db/connection.js");

exports.selectArticles = () => {
  return db.query("SELECT * FROM articles;").then((result) => {
    return result.rows;
  });
};

exports.selectSpecialOffers = () => {
  return db.query("SELECT * FROM specialOffers;").then((result) => {
    return result.rows;
  });
};

exports.selectCategories = () => {
  return db.query("SELECT * FROM categories;").then((result) => {
    return result.rows;
  });
};
