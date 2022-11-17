const {
  selectArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  updateArticle,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  selectArticles(sort_by, order, topic)
    .then((articles) => {
      if (articles.length === 0) {
        res.status(200).send({ msg: "No articles with this topic yet!" });
      } else res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const newComment = req.body;
  const articleId = req.params.article_id;
  newComment.article_id = Number(articleId);
  insertCommentByArticleId(newComment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes: newVote } = req.body;
  updateArticle(article_id, newVote)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
