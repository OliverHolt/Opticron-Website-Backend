const db = require("../db/connection.js");
const { checkArticleExists } = require("../utils/db.js");

exports.selectArticles = (sort_by = "created_at", order = "DESC", topic) => {
  //greenlist of valid sort_by queries
  const validColumns = ["author", "title", "topic", "created_at", "votes"];
  const validOrder = ["ASC", "DESC"];
  if (!validColumns.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "invalid sort query" });
  }

  let queryStr = `
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
  ON articles.article_id = comments.article_id`;

  const queryValues = [];

  if (topic) {
    queryStr += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  queryStr += ` GROUP BY articles.article_id
  ORDER BY articles.${sort_by} ${order};
  `;
  return db.query(queryStr, queryValues).then((result) => {
    if (/[^0-9]+/.test(topic) === false) {
      return Promise.reject({ status: 400, msg: "invalid filter query" });
    } else return result.rows;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `
  SELECT 
  articles.author,
  articles.title,
  articles.article_id,
  articles.body,
  articles.topic,
  articles.created_at,
  articles.votes,
  COUNT(comments.article_id) AS comment_count
  FROM articles
  JOIN comments
  ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id;
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
      "INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;",
      [body, article_id, username]
    )

    .then((result) => {
      return result.rows[0];
    });
};

exports.updateArticle = (article_id, newVote) => {
  return db
    .query(
      `
    SELECT votes FROM articles
    WHERE article_id = $1
    `,
      [article_id]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      totalVoteCount = res.rows[0].votes + newVote;
      return db.query(
        "UPDATE articles SET votes = $2 WHERE article_id = $1 RETURNING*;",
        [article_id, totalVoteCount]
      );
    })
    .then((results) => {
      return results.rows[0];
    });
};
