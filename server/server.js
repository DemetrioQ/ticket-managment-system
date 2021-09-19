const express = require('express');
var bodyParser = require('body-parser');
const path = require('path');
const db = require('./models');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config('./env');

const PORT = process.env.PORT || 3001;

const app = express();

db.sequelize.sync();

require('./config/passport-config')(passport);
require('./config/JwtStrategy')(passport);
require('./auth');

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(bodyParser.urlencoded({ extended: true }));

const whitelist = process.env.WHITELISTED_DOMAINS ? process.env.WHITELISTED_DOMAINS.split(',') : [];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },

  credentials: true,
};

app.use(cors({ corsOptions }));

app.use(passport.initialize());

require('./routes/routes')(app);

app.listen(PORT, () => {
  console.log(`Server listeniong on ${PORT}`);
});
