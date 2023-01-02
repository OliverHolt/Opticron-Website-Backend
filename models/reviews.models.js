const db = require("../db/connection.js");

exports.selectReviews = () => {
  return db.query("SELECT * FROM reviews;").then((result) => {
    return result.rows;
  });
};
