const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');


router.get('/', (req, res) => {
    res.render('profile', {
        profileOwnerName: req.user.name,
        user: req.user
    })
});

router.get('/update', async(req, res) => {
    try {
        res.render('profile_update', {
            user: req.user
        })
    } catch (err) {
        res.redirect("/error_page", {
            error: "Not Found"
        });
    }
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