let express = require("express");
let router = express.Router();
const Project = require('../../models/Project')
const User = require('../../models/User');
const Task = require('../../models/Task');
const Board = require('../../models/Board');
const List = require('../../models/List');
const project = require('./projects');

router.route("/")
    .post(function asynk(req, res) {
        const {
            name,
            description,
            list
        } = req.body;
        let requser = res.locals.user._id;
        List.findById(board, (err, doc_board) => {
            if (err || !doc_board)
                res.status(400).json({
                    message: "Wrong board id"
                });
            if (requser.equals(proj.user)) {
                Task.create({
                        name,
                        description,
                        project: proj._id,
                        user: requser
                    },
                    function (err, board) {
                        if (err) return res.status(400).json({
                            message: err.message
                        });
                        proj.boards.push(board._id);
                        proj.save((err, project) => {
                            if (err)
                                console.log(err);
                        });
                        res.status(200).json({
                            message: 'Board created!',
                            board_id: board._id
                        })
                    })
            }
        })
    })


module.exports = router;