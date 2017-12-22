const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const config = require('../../config');


module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).redirect('/register/login');
  }

  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization.split(' ')[1];
  // decode the token using a secret key-phrase
  return jwt.verify(token, config.jwtSecret, (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) { return res.status(401).end(); }

    const userId = decoded.sub;
    return User.findById(userId, (userErr, user) => {
      if (userErr || !user) {
        return res.status(401).redirect('/register/login');
      }
      res.locals.user = user
      return next();
    });
  });
};


module.exports.adminCheck = (req, res, next) => res.locals.user.role === 'admin' ?
    next() :
    res.status(403).render("error_page",{
        user: req.user,
        message: 'You should have admin permissions.'
    })