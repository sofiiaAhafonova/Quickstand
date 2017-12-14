const User = require('mongoose').model('User');
const PassportLocalStrategy = require('passport-local').Strategy;


module.exports = new PassportLocalStrategy({
  usernameField: 'name',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, name, password, done) => {
    User.create({
    email:  req.body.email.trim(),
    password: password.trim(),
    name: name.trim()
  },(err, doc) => {
       if (err) { return done(err); }
        return done(null);
  });
});