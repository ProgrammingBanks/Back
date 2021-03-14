const passport = require('passport');
const local = require('./local');
const { clientTB } = require('../models');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.clientEmail);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await clientTB.findOne({ where: {clientEmail }});
      done(null, user); // req.user
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
};