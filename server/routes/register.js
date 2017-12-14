const express = require('express');
const passport = require('passport');
const validator = require('validator');
const router = express.Router();
const User = require('../models/User');


function validateSignupForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
    isFormValid = false;
    errors.email = 'Please provide a correct email address.';
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 4) {
    isFormValid = false;
    errors.password = 'Password must have at least 4 characters.';
  }

  if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
    isFormValid = false;
    errors.name = 'Please provide your name.';
  }
  if (payload.password.localeCompare(payload.verify) != 0) {
    isFormValid = false;
    errors.password = "Passwords don't match";
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

function validateLoginForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
    isFormValid = false;
    errors.name = 'Please provide your name.';
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
    isFormValid = false;
    errors.password = 'Please provide your password.';
  }


  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}



router.post('/signup', (req, res, next) => {
 
  const validationResult = validateSignupForm(req.body);
  if (!validationResult.success) {
    req.flash('error',  validationResult.errors.password)
    return res.redirect('/register/signup');
  }
  return passport.authenticate('local-signup', (err) => {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        req.flash('error', 'This name is already taken.');
        return res.redirect('/register/signup');
      }
      req.flash('error', 'Could not process the form.');
      return res.redirect('/register/signup');
    }
    return res.redirect('/');
  })(req, res, next);
});

router.post('/login', (req, res, next) => {
  const validationResult = validateLoginForm(req.body);
  if (!validationResult.success) {
    req.flash('error',  validationResult.errors.password)
    return res.redirect('/register/login')

  }
  return passport.authenticate('local-login', (err, token, userData) => {
    if (err) {
      if (err.name === 'IncorrectCredentialsError') {
        req.flash('error',  err.message)
        return res.redirect('/register/login')
      }
      req.flash('error',  'Could not process the form.')
      return res.redirect('/register/login')
    }
    req.logIn(userData, function (err) {
      if (err) res.sendStatus(401)
      res.redirect('/')
    })
     
  })(req, res, next);
});


router.get('/login', (req, res) => {
  res.render('login', {
    error: req.flash('error')[0],
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