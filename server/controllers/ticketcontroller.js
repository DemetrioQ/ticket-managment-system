const Ticket = require('../models').Ticket;
//create and save ticket
exports.getTicket = (req, res) => {
  if (!req.body.id) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
    return;
  }
};

exports.CreateTicket = (req, res) => {
  if (!req.body.title || !req.body.description || !req.body.priority) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
    return;
  }
  const ticket = {
    title: req.body.title,
    user_id: req.user.id,
    description: req.body.description,
    priority_id: req.body.priority,
  };
  console.log(ticket);
  Ticket.create(ticket).catch((err) => {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating the ticket.',
    });
  });
};

exports.UpdateTicket = (req, res) => {
  if (!req.body.title || !req.body.description || !req.body.priority) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
    return;
  }
  const ticket = {
    id: req.body.id,
    title: req.body.title,
    description: req.body.description,
    priority_id: req.body.priority,
  };
  const id = req.body.id;
  Ticket.update(
    { title: ticket.title, description: ticket.description, priority_id: ticket.priority_id },
    {
      where: {
        id: ticket.id,
      },
    }
  ).catch((err) => {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating the ticket.',
    });
  });
};

exports.DeleteTicket = (req, res) => {
  if (!req.body.id) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
    return;
  }
  const id = req.body.id;
  Ticket.destroy({
    where: {
      id: id,
    },
  })
    .then((ticket) => {
      res.send({ success: true });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the ticket.',
      });
    });
};
