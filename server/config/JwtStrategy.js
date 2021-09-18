const passport = require('passport');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const JwtStrategy = require('passport-jwt').Strategy;
ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models').User;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken('JWT');
opts.secretOrKey = process.env.JWT_SECRET;

// Used by the authenticated requests to deserialize the user,
// i.e., to fetch user details from the JWT.
function initialize(passport) {
  const authenticateuser = (jwt_payload, done) => {
    User.findOne({ where: { id: jwt_payload.id } }).then((user) => {
      if (user) {
        return done(null, user);
      } else {
        console.log('false');

        return done(null, false);
        // or you could create a new account
      }
    }).catch(err =>{
        return done(err, false)
    });
  };

  passport.use(new JwtStrategy(opts, authenticateuser));
}

module.exports = initialize;
