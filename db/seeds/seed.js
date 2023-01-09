const format = require("pg-format");
const db = require("../connection");
const { createRef, formatReviews } = require("./utils");

const seed = async ({ userData, reviewsData, toiletData }) => {
  await db.query(`DROP TABLE IF EXISTS reviews;`);
  await db.query(`DROP TABLE IF EXISTS toilets;`);
  await db.query(`DROP TABLE IF EXISTS users cascade;`);

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

  await Promise.all([usersTablePromise, toiletsTablePromise]);

  await db.query(`
  CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    body VARCHAR,
    toilet_id VARCHAR REFERENCES toilets(place_id),
    author VARCHAR REFERENCES users(username),
    votes INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );`);

  const insertUsersQueryStr = format(
    "INSERT INTO users ( username, email, avatar_url, password) VALUES %L RETURNING *;",
    userData.map(({ username, email, avatar_url, password }) => [
      username,
      email,
      avatar_url,
      password,
    ])
  );
  const usersPromise = await db
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

  await Promise.all([toiletsPromise, usersPromise]);

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
