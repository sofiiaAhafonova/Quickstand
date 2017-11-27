const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');


router.get('/', (req, res) => {
    res.render('profile', {
        profileOwner: req.user,
        user: req.user
    })
});

router.get('/:user_name', (req, res) => {
    let user_name = req.params.user_name;
    if (!req.user)
        res.redirect("/register/login");
    else {
        User.findOne({
            "name": user_name
        }, (err, profileOwner) => {
            if (err) return res.redirect("/");
            console.log(profileOwner);
            res.render('profile', {
                profileOwner,
                user: req.user
            })
        });
    }

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