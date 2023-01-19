const format = require("pg-format");
const db = require("../connection");
const { createRef, formatReviews } = require("./utils");

const seed = async ({ articleData, specialOffersData, categoryData }) => {
  // await db.query(`DROP TABLE IF EXISTS comments cascade;`);
  await db.query(`DROP TABLE IF EXISTS articles;`);
  await db.query(`DROP TABLE IF EXISTS specialOffers;`);
  await db.query(`DROP TABLE IF EXISTS categories;`);

  const articleTablePromise = db.query(`
  CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR,
    image_url VARCHAR,
    description VARCHAR
  );`);

  const specialOffersTablePromise = db.query(`
  CREATE TABLE specialOffers (
    offer_id SERIAL PRIMARY KEY,
    title VARCHAR,
    image_url VARCHAR,
    description VARCHAR
  );`);

  const categoriesTablePromise = db.query(`
  CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR,
    image_url VARCHAR
  );`);

  await Promise.all([
    articleTablePromise,
    specialOffersTablePromise,
    categoriesTablePromise,
  ]);

  const insertArticlesQueryStr = format(
    "INSERT INTO articles (title, image_url, description) VALUES %L RETURNING *;",
    articleData.map(({ title, image_url, description }) => [
      title,
      image_url,
      description,
    ])
  );
  const articlesPromise = await db
    .query(insertArticlesQueryStr)
    .then((result) => result.rows);

  const insertSpecialOffersQueryStr = format(
    "INSERT INTO specialOffers (title, image_url, description) VALUES %L RETURNING *;",
    specialOffersData.map(({ title, image_url, description }) => [
      title,
      image_url,
      description,
    ])
  );
  const specialOffersPromise = await db
    .query(insertSpecialOffersQueryStr)
    .then((result) => result.rows);

  const insertCategoriesQueryStr = format(
    "INSERT INTO categories (category_name, image_url) VALUES %L RETURNING *;",
    categoryData.map(({ category_name, image_url }) => [
      category_name,
      image_url,
    ])
  );
  const categoryPromise = await db
    .query(insertCategoriesQueryStr)
    .then((result) => result.rows);

  await Promise.all([articlesPromise, specialOffersPromise, categoryPromise]);

  // const toiletIdLookup = createRef(toiletsPromise, "name", "place_id");
  // const formattedReviewsData = formatReviews(reviewsData, toiletIdLookup);

  // const insertReviewsQueryStr = format(
  //   "INSERT INTO reviews (body, author, toilet_id, votes, created_at) VALUES %L RETURNING *;",
  //   formattedReviewsData.map(
  //     ({ body, author, toilet_id, votes = 0, created_at }) => [
  //       body,
  //       author,
  //       toilet_id,
  //       votes,
  //       created_at,
  //     ]
  //     )
  //   );
  // await Promise.all([toiletsPromise]);

  // return db.query(insertReviewsQueryStr).then((result) => result.rows);
};

module.exports = seed;
