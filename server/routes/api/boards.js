let express = require("express");
let router = express.Router();
const Project = require('../../models/Project')
const User = require('../../models/User');
const Board = require('../../models/Board');
const List = require('../../models/List');

const valideFields = ['name', 'description']

router.route("/")
    .post(async function (req, res) {
        const {
            name,
            description,
            project
        } = req.body;
        let requser = res.locals.user._id;
        Project.findById(project, (err, proj) => {
            if (err || !proj)
                return res.status(400).json({
                    message: "Wrong project id"
                });
            if (requser.equals(proj.user)) {
                Board.create({
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

router.route("/:board_id")
    .get(async function (req, res) {
        let id = req.params.board_id;
        Board.findById(id, (err, board) => {
            if (err)
                return res.status(400).json({
                    message: "Invalid request"
                });
            if (!board)
                return res.status(404).json({
                    message: "No boards were found"
                });
            let requser = res.locals.user._id;
            if (board.team.find(user => requser.equals(user)) || requser.equals(board.user))
                return res.status(200).json({
                    board
                })
            else
                return res.status(403).json({
                    message: "You couldn't view this board"
                });
        })
    })
    .put(async function (req, res) {
        let id = req.params.board_id;
        const {
            name,
            description,
            project
        } = req.body;
        Board.findById(id, (err, board) => {
            if (err)
                return res.status(400).json({
                    message: "Invalid request"
                });
            if (!board)
                return res.status(404).json({
                    message: "No boards were found"
                });
            let requser = res.locals.user._id;
            if (requser.equals(board.user)) {
                if (name) board.name = name;
                if (description) board.description = description;
                board.save((err, board) => {
                    if (err) return res.status(400).json({
                        message: "Invalid request"
                    })
                    return res.status(200).json({
                        message: "Board updated",
                        id: board._id
                    })
                })
            } else
                return res.status(403).json({
                    message: "You couldn't update this project"
                });
        })

    })
    .delete(async function (req, res) {
        let id = req.params.board_id;
        Board.findById(id, (err, board) => {
            if (err)
                return res.status(400).json({
                    message: "Invalid request"
                });
            if (!board)
                return res.status(404).json({
                    message: "No boards were found"
                });
            let requser = res.locals.user._id;
            if (requser.equals(board.user)) {
                board.remove((err, board) => {
                    if (err) return res.status(400).json({
                        message: "Invalid request"
                    })
                    Project.findById(board.project, (error, project) => {
                        if (error) return res.status(400).json({
                            message: "Invalid request"
                        })
                        project.boards = project.boards.filter(function (i) {
                            return !i.equals(board._id)
                        });
                        project.save();
                        return res.status(200).json({
                            message: "Board deleted",
                            id: board._id
                        })
                    })

                })
            } else
                return res.status(403).json({
                    message: "You couldn't delete this board"
                });
        })
    })

router.route("/:board_id/lists")
    .get(async function (req, res) {
        let id = req.params.board_id;
        Board.findById(id, (err, board) => {
            if (err)
                return res.status(400).json({
                    message: "Invalid request"
                });
            if (!board)
                return res.status(404).json({
                    message: "No boards were found"
                });
            let requser = res.locals.user._id;
            if (board.team.find(user => requser.equals(user)) || requser.equals(board.user)) {
                List.find({
                    "board": id
                }, (err, lists)=> {
                    if (err)
                        return res.status(400).json({
                            message: "Invalid request"
                        });
                    if (!lists)
                        return res.status(404).json({
                            message: "No lists were found"
                        });
                    return res.status(200).json({
                        lists
                    })
                })
            } else
                return res.status(403).json({
                    message: "You couldn't view this board"
                });
        })
    });

module.exports = router;