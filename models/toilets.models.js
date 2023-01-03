const db = require("../db/connection.js");
const { checkToiletExists } = require("../utils/db.js");

exports.selectToilets = () => {
  return db.query("SELECT * FROM toilets;").then((result) => {
    return result.rows;
  });
};

exports.insertToilet = ({
  place_id,
  name,
  formatted_address,
  business_status,
}) => {
  return checkToiletExists(place_id)
    .then((res) => {
      console.log(res);
      if (res === false) {
        return db.query(
          `
    INSERT INTO toilets (place_id, name, formatted_address, business_status) VALUES ($1, $2, $3, $4) RETURNING *;
    `,
          [place_id, name, formatted_address, business_status]
        );
      } else {
        return Promise.reject({
          status: 400,
          msg: "Toilet already exists",
        });
      }
    })

    .then((result) => {
      return result.rows[0];
    });
};
