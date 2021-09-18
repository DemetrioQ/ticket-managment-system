const Ticket = require('../models').Ticket;
//create and save user
exports.getTicket = (req, res) => {
  if (!req.body.id) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
    return;
  }
};
