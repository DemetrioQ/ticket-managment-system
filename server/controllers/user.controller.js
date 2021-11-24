const User = require('../models').User;
const Ticket = require('../models').Ticket;
const Priority = require('../models').Priority;

//create and save user
exports.insertUser = (req, res) => {
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
    .then(() => {
      res.send({ success: true });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the User.',
      });
    });
};

exports.getTickets = (req, res) => {
  const id = req.user.id;
  Ticket.findAll({
    include: [
      {
        model: User,
        required: true,
        where: { id: id },
        attributes: [],
      },
      {
        model: Priority,
        required: true,
        attributes: ['priority', 'id'],
      },
    ],
    attributes: ['id', 'title', 'description'],
  })
    .then(async (response) => {
      res.send(response);
    })
    .catch((err) => console.log(err));
};
