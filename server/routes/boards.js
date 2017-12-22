const express = require('express');
const Project = require('../models/Project')
const User = require('../models/User');
const Board = require('../models/Board');

const router = express.Router();

router.route("/:board_id")
    .get(function (req, res) {
        let id = req.params.board_id;
        console.log(req.user);
        Board.findById(id, (err, board) => {
            if (err)
                return res.status(400).json({
                    message: "Invalid request"
                });
            if (!board)
                return res.status(404).json({
                    message: "No boards were found"
                });
           
            let requser ='';// req.user._id;
            if (board.team.find(user => requser.equals(user)) || requser.equals(board.user))
                res.render('board', {
                    user: req.user,
                    board
                })
            else
                return res.status(403).json({
                    message: "You couldn't view this project"
                });
        })
    })

module.exports = router;