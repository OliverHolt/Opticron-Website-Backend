const fs = require("fs");
const path = require("path");

exports.getEndpoints = (req, res, next) => {
  fs.readFile(path.join(__dirname, "../endpoints.json"), (err, data) => {
    if (err) throw err;

    res.status(200).send(JSON.parse(data));
  });
};
