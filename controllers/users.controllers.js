const { selectUsers, insertUser } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postUser = (req, res, next) => {
  newUser = req.body;
  insertUser(newUser)
    .then((insertedUser) => {
      res.status(201).send(insertedUser);
    })
    .catch((err) => {
      console.log(err);
    });
};
