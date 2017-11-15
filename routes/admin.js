const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/', async(req, res) => {
    res.render('admin', {
        user: req.user
    })
});

router.get('/allusers', async(req, res) => {
    const users = await User.find({
        role: 'user'
    });
    const admins = await User.find({
        role: 'admin'
    });
    res.render('allusers', {
        users: users,
        admins: admins,
        empty: users.length === 0 && admins.length === 0,
        user: req.user
    })
});

module.exports = router;