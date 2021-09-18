const User = require('../models').User;
const { getToken, COOKIE_OPTIONS, getRefreshToken } = require('../auth.js');
//create and save user
exports.InsertUser = (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.email) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
    return;
  }
  const user = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  };

  User.create(user)
    .then((user) => {
      const token = getToken({ _id: user.id });
      const refreshToken = getRefreshToken({ _id: user.id });
      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
      res.send({ success: true, token });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the User.',
      });
    });
};
