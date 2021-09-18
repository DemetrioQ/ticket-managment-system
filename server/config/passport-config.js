const authenticate = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models').User;

function initialize(passport) {
  const authenticateuser = (email, password, done) => {
    User.findOne({ where: { email: email } })
      .then((user) => {
        if (!user) {
          return done(null, false);
        }
        if (!User.verifyPassword(password, user.password)) {
          return done(null, false);
        }
        return done(null, user);
      })
      .catch((err) => {
        return done(err, false);
      });
  };
  passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, authenticateuser));
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findByPk(id, (err, user) => {
      done(null, user);
    });
  });
}

module.exports = initialize;
