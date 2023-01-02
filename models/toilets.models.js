const db = require("../db/connection.js");

exports.selectToilets = () => {
  return db.query("SELECT * FROM toilets;").then((result) => {
    return result.rows;
  });
};
