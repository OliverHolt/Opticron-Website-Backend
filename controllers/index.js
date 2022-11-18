const fs = require("fs");

exports.getEndpoints = (req, res, next) => {
  fs.readFile(
    "/home/oliverholt/northcoders/backend/be-nc-news/endpoints.json",
    (err, data) => {
      if (err) throw err;

      res.status(200).send(JSON.parse(data));
    }
  );
};
