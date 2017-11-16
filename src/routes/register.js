const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');

router.post('/signup', async(req, res) => {
  try {
    let userRole;
    if (req.user) {
      if (req.user.role === 'admin')
        userRole = 'admin';
    } else userRole = 'user';
    if (req.body.password === req.body.verify) {
      User.create({
        name: req.body.name.trim(),
        password: req.body.password.trim(),
        role: userRole
      });
      res.redirect('/register/login');
    } else {
      req.flash('error', 'Passwords not matched');
      res.redirect('/register/signup');
    }
  } catch (error) {
    console.log(error);
    if (error.code === 11000) { // unique key used
      req.flash('error', 'Username is not available')
    } else req.flash('error', error.message)
    res.redirect('/register/login');
  }
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/register/login',
    failureFlash: true
  })
);

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