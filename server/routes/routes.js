const priority = require('../models/priority.js');
const user = require('../models/user.js');

module.exports = (app) => {
  const passport = require('passport');
  const aut = require('../auth.js');
  const userController = require('../controllers/usercontroller');
  const path = require('path');
  const { getToken, COOKIE_OPTIONS, getRefreshToken, verifyUser } = require('../auth.js');
  const jwt = require('jsonwebtoken');
  const Ticket = require('../models').Ticket;
  const User = require('../models').User;
  const Priority = require('../models').Priority;


  app.post('/register', (req, res) => {
    userController.InsertUser(req, res);
  });

  app.post('/login', passport.authenticate('local'), function (req, res) {
    const token = getToken({ id: req.user.id });
    const refreshToken = getRefreshToken({ id: req.user.id });
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.send({ success: true, token });
  });

  app.post('/refreshToken', (req, res, next) => {
    console.log('looking...');
    const { signedCookies = {} } = req;
    console.log(signedCookies);
    const { refreshToken } = signedCookies;
    if (refreshToken) {
      try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        console.log(payload);

        const userId = payload.id;
        const token = getToken({ id: userId });
        const newRefreshToken = getRefreshToken({ id: userId });
        res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);
        res.send({ success: true, token });
      } catch (err) {
        res.statusCode = 401;
        res.send('Unauthorized');
      }
    } else {
      res.statusCode = 401;
      res.send('Unauthorized');
    }
  });

  app.get('/me', verifyUser, (req, res, next) => {
    res.send(req.user);
  });

  app.get('/user/tickets', verifyUser, (req, res, next) => {
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
          attributes: ['priority'],
        },
      ],
      attributes: ['id', 'title', 'description'],
    })
      .then(async (response) => {
        res.send(response);
        // const data = {
        //   title: response.title,
        //   description: response.description,
        //   priority: response.Priority.priority,
        // };
        // res.send(data)
      })
      .catch((err) => console.log(err));
  });


  app.get('/logout', verifyUser, (req, res, next) => {
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    res.send({ success: true });
  });
};
