const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get("/:board_id",  async(req, res) => {
    res.render('board', {
        user: req.user,
    })
});

module.exports = router;