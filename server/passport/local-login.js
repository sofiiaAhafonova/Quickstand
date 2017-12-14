const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const PassportLocalStrategy = require('passport-local').Strategy;
const config = require('../../config');

module.exports = new PassportLocalStrategy({
  usernameField: 'name',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, name, password, done) => {
  const userData = {
    name: name.trim(),
    password: password.trim()
  };

  return User.findOne({ name: userData.name }, (err, user) => {
    if (err) { return done(err); }

    if (!user) {
      const error = new Error('Incorrect email or password');
      error.name = 'IncorrectCredentialsError';

      return done(error);
    }

    // check if a hashed user's password is equal to a value saved in the database
    return user.comparePassword(userData.password, (passwordErr, isMatch) => {
      if (err) { return done(err); }

      if (!isMatch) {
        const error = new Error('Incorrect name or password');
        error.name = 'IncorrectCredentialsError';

        return done(error);
      }

      const payload = {
        sub: user._id
      };

      // create a token string
      const token = jwt.sign(payload, config.jwtSecret);
      const data = {
        name: user.name
      };

      return done(null, token, user);
    });
  });
});