const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');

router.post('/signup', async(req, res) => {
  try {
    if (req.body.password === req.body.verify) {
      User.create({
        name: req.body.name.trim(),
        password: req.body.password.trim(),
        email: req.body.email.trim()
      }, (err, doc) => {
        if (err) {
          if (err.code === 11000) { // unique key used
            req.flash('error', 'Username is not available')
          } else req.flash('error', err.message);
          return res.redirect('/register/signup');
        }
        res.redirect('/register/login');
      });
    } else {
      req.flash('error', "Passwords don't match");
      res.redirect('/register/signup');
    }
  } catch (error) {
    res.redirect('/error_page', {
      error
    });
  }
});
router.post('/login',  async (req, res, next) => {
  return passport.authenticate('local', (err, user) => {
    if (err) {
      req.flash('error', err)
      return res.redirect('/register/login')
    }
    req.logIn(user, function (err) {
      if (err) res.sendStatus(401)
      const convert = req.body.name + ":" + req.body.password;
      res.cookie('isAdmin', req.user.role === 'admin');
      res.cookie('name', req.user.name);
      res.cookie('basic', new Buffer(convert).toString('base64'));
      res.redirect('/')
    })
  })(req, res, next)
});



router.get('/login', (req, res) => {
  res.render('login', {
    error: req.flash('error')[0],
    message: req.flash('message')[0],
    user: null
  });
});

router.get('/signup', (req, res) => {
  res.render('signup', {
    error: req.flash('error')[0],
    user: null
  });
});

router.get('/logout',
  (req, res) => {
    req.logout();
    res.redirect('/');
  });


module.exports = router;