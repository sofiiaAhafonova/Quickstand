const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');


router.get('/', async(req, res) => {
    res.render('profile', {
        profileOwner: req.user,
        user: req.user
    })
});

router.get('/own/update', async(req, res) => {
    res.render('profile_update', {
        user: req.user
    })
});

router.get('/:user_name',async (req, res, next) => {
    let user_name = req.params.user_name;
    User.findOne({
        "name": user_name
    }, (err, profileOwner) => {
        if (err || !profileOwner) return next();
        return res.render('profile', {
            profileOwner,
            user: req.user
        })
    });
});



router.post('/update', async(req, res) => {
    User.findByIdAndUpdate(req.user.id, {
        $set: {
            email: req.body.email
        }
    }, (err, doc) => {
        if (err) return res.redirect("/profile_update", {
            user: req.user
        });
        res.redirect('/profile');
    })
});

module.exports = router;