const db = require("../db/connection.js");

exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then((result) => {
    return result.rows;
  });
};

exports.insertUser = (newUser) => {
  const { username, email, password } = newUser;
  let queryStr = `
  INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;
  `;
  return db.query(queryStr, [username, email, password]).then((res) => {
    return res.rows[0];
  });
};
