const db = require("../db/connection.js");
const { checkArticleExists } = require("../utils/db.js");

exports.selectArticles = () => {
  return db
    .query(
      `
    SELECT 
    articles.author,
    articles.title,
    articles.article_id,
    articles.topic,
    articles.created_at,
    articles.votes,
    COUNT(comments.article_id) AS comment_count
    FROM articles
    JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
    `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `
  SELECT * FROM articles
  WHERE article_id = $1;
  `,
      [article_id]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found!" });
      }
      return res.rows;
    });
};

exports.fetchCommentsByArticleId = (article_id) => {
  return checkArticleExists(article_id)
    .then(() => {
      return db.query(
        `
  SELECT * FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC;
  `,
        [article_id]
      );
    })
    .then((res) => {
      return res.rows;
    });
};

exports.insertCommentByArticleId = ({ body, article_id, username }) => {
  if (!username || !body || typeof body === "number") {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db
    .query(
      "INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;",
      [body, article_id, username]
    )

    .then((result) => {
      return result.rows[0];
    });
};
