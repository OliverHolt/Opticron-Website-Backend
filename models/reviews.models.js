const db = require("../db/connection.js");

exports.selectReviews = () => {
  return db.query("SELECT * FROM reviews;").then((result) => {
    return result.rows;
  });
};

exports.fetchReviewsByToiletId = (toilet_id) => {
  return db
    .query(
      `
    SELECT * FROM reviews
    WHERE toilet_id = $1
    ORDER BY created_at DESC;
    `,
      [toilet_id]
    )
    .then((res) => {
      return res.rows;
    });
};

exports.insertReviewByToiletId = ({ body, toilet_id, username }) => {
  if (
    !username ||
    !body ||
    typeof body !== "string" ||
    typeof username === undefined
  ) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db
    .query(
      `INSERT INTO reviews (body, toilet_id, author) VALUES ($1, $2, $3) RETURNING *;`,
      [body, toilet_id, username]
    )

    .then((result) => {
      return result.rows[0];
    });
};
