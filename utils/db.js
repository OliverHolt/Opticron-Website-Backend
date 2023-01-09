const db = require("../db/connection.js");

exports.checkToiletExists = (place_id) => {
  return db
    .query(
      `
  
  SELECT * FROM toilets
  WHERE place_id = $1

  `,
      [place_id]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        return false;
      } else {
        return true;
      }
    });
};
