const format = require("pg-format");
const db = require("../connection");
const {
  convertTimestampToDate,
  createRef,
  formatComments,
  formatReviews,
} = require("./utils");

const seed = async ({
  topicData,
  userData,
  articleData,
  commentData,
  reviewsData,
  toiletData,
}) => {
  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS articles;`);
  await db.query(`DROP TABLE IF EXISTS reviews;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS topics;`);
  await db.query(`DROP TABLE IF EXISTS toilets;`);

  const topicsTablePromise = db.query(`
  CREATE TABLE topics (
    slug VARCHAR PRIMARY KEY,
    description VARCHAR
  );`);

  const usersTablePromise = db.query(`
  CREATE TABLE users (
    username VARCHAR PRIMARY KEY,
    email VARCHAR,
    avatar_url VARCHAR,
    password VARCHAR
  );`);

  const toiletsTablePromise = db.query(`
  CREATE TABLE toilets (
    place_id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL, 
    formatted_address VARCHAR NOT NULL,
    business_status VARCHAR
  );`);

  await Promise.all([
    topicsTablePromise,
    usersTablePromise,
    toiletsTablePromise,
  ]);

  await db.query(`
  CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    topic VARCHAR NOT NULL REFERENCES topics(slug),
    author VARCHAR NOT NULL REFERENCES users(username),
    body VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    votes INT DEFAULT 0 NOT NULL
  );`);

  await db.query(`
  CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    body VARCHAR NOT NULL,
    article_id INT REFERENCES articles(article_id) NOT NULL,
    author VARCHAR REFERENCES users(username) NOT NULL,
    votes INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );`);

  await db.query(`
  CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    body VARCHAR,
    toilet_id VARCHAR REFERENCES toilets(place_id),
    author VARCHAR REFERENCES users(username),
    votes INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );`);

  const insertTopicsQueryStr = format(
    "INSERT INTO topics (slug, description) VALUES %L RETURNING *;",
    topicData.map(({ slug, description }) => [slug, description])
  );
  const topicsPromise = db
    .query(insertTopicsQueryStr)
    .then((result) => result.rows);

  const insertUsersQueryStr = format(
    "INSERT INTO users ( username, email, avatar_url, password) VALUES %L RETURNING *;",
    userData.map(({ username, email, avatar_url, password }) => [
      username,
      email,
      avatar_url,
      password,
    ])
  );
  const usersPromise = db
    .query(insertUsersQueryStr)
    .then((result) => result.rows);

  const insertToiletsQueryStr = format(
    "INSERT INTO toilets (place_id, name, formatted_address, business_status) VALUES %L RETURNING *;",
    toiletData.map(({ place_id, name, formatted_address, business_status }) => [
      place_id,
      name,
      formatted_address,
      business_status,
    ])
  );
  const toiletsPromise = await db
    .query(insertToiletsQueryStr)
    .then((result) => result.rows);

  await Promise.all([topicsPromise, usersPromise]);

  const formattedArticleData = articleData.map(convertTimestampToDate);
  const insertArticlesQueryStr = format(
    "INSERT INTO articles (title, topic, author, body, created_at, votes) VALUES %L RETURNING *;",
    formattedArticleData.map(
      ({ title, topic, author, body, created_at, votes = 0 }) => [
        title,
        topic,
        author,
        body,
        created_at,
        votes,
      ]
    )
  );

  const articleRows = await db
    .query(insertArticlesQueryStr)
    .then((result) => result.rows);

  const articleIdLookup = createRef(articleRows, "title", "article_id");
  const formattedCommentData = formatComments(commentData, articleIdLookup);

  const insertCommentsQueryStr = format(
    "INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L RETURNING *;",
    formattedCommentData.map(
      ({ body, author, article_id, votes = 0, created_at }) => [
        body,
        author,
        article_id,
        votes,
        created_at,
      ]
    )
  );

  const commentsPromise = db
    .query(insertCommentsQueryStr)
    .then((result) => result.rows);

  await Promise.all([commentsPromise]);

  const toiletIdLookup = createRef(toiletsPromise, "name", "place_id");
  const formattedReviewsData = formatReviews(reviewsData, toiletIdLookup);

  const insertReviewsQueryStr = format(
    "INSERT INTO reviews (body, author, toilet_id, votes, created_at) VALUES %L RETURNING *;",
    formattedReviewsData.map(
      ({ body, author, toilet_id, votes = 0, created_at }) => [
        body,
        author,
        toilet_id,
        votes,
        created_at,
      ]
    )
  );
  await Promise.all([toiletsPromise]);

  return db.query(insertReviewsQueryStr).then((result) => result.rows);
};

module.exports = seed;
