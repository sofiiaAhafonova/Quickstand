const express = require('express');
const Project = require('../models/Project')
const User = require('../models/User');
const Board = require('../models/Board');
var path = require('path');
const router = express.Router();

router.route("/:board_id")
    .get(function (req, res, next) {
        let id = req.params.board_id;
       
        Board.findById(id, (err, board) => {               
            if (err || !board)
                return res.status(404).render('error_page',{
                    user: req.user,
                    message: "No boards were found"
                });
            let requser
            if(req.user)
                requser = req.user._id;
            if (requser && (board.team.find(user => requser.equals(user)) || requser.equals(board.user)))
                res.sendFile(path.join(__dirname + '/../views/board.html'));
            else
                return res.status(403).render('error_page',{
                    user: req.user,
                    message: "You couldn't view this board"
                });
        })
    })

module.exports = router;