let express = require("express");
let router = express.Router();
const Project = require('../../models/Project')
const User = require('../../models/User');
const Task = require('../../models/Task');
const List = require('../../models/List');
const Board = require('../../models/Board');
const project = require('./projects');

router.route("/")
    .post(async function (req, res) {
        const {
            name,
            board
        } = req.body;
        let requser = res.locals.user._id;
        Board.findById(board, (err, doc_board) => {
            if (err)
                console.log(err);
            if (err || !doc_board)
                return res.status(400).json({
                    message: "Wrong board id"
                });
            if (requser.equals(doc_board.user)) {
                List.create({
                        name,
                        board: doc_board._id,
                        project: doc_board.project,
                        user: requser
                    },
                    function (err, list) {
                        if (err) return res.status(400).json({
                            message: err.message
                        });
                        doc_board.lists.push(list._id);
                        doc_board.save((err) => {
                            if (err)
                                console.log(err);
                        });
                        res.status(200).json({
                            message: 'List created!',
                            list_id: list._id
                        })
                    })
            }
        })
    })


router.route("/:list_id")
    .get(async function (req, res) {
        let id = req.params.list_id;
        List.findById(id, (err, list) => {
            if (err)
                return res.status(400).json({
                    message: "Invalid request"
                });
            if (!list)
                return res.status(404).json({
                    message: "No lists were found"
                });
            let requser = res.locals.user._id;
            if (list.team.find(user => requser.equals(user)) || requser.equals(list.user))
                return res.status(200).json({
                    list
                })
            else
                return res.status(403).json({
                    message: "You couldn't view this list"
                });
        })
    })
    .put(async function (req, res) {
        let id = req.params.list_id;
        const {
            name,
            board
        } = req.body;
        List.findById(id, (err, list) => {
            if (err)
                return res.status(400).json({
                    message: "Invalid request"
                });
            if (!list)
                return res.status(404).json({
                    message: "No lists were found"
                });
            let requser = res.locals.user._id;
            if (requser.equals(list.user)) {
                if (name) list.name = name;
                list.save((err) => {
                    if (err) return res.status(400).json({
                        message: "Invalid request"
                    })
                    return res.status(200).json({
                        message: "List updated",
                        id: list._id
                    })
                })
            } else
                return res.status(403).json({
                    message: "You couldn't update this list"
                });
        })

    })
    .delete(async function (req, res) {
        let id = req.params.list_id;
        List.findById(id, (err, list) => {
            if (err)
                return res.status(400).json({
                    message: "Invalid request"
                });
            if (!list)
                return res.status(404).json({
                    message: "No boards were found"
                });
            let requser = res.locals.user._id;
            if (requser.equals(list.user)) {
                list.remove((err) => {
                    if (err) return res.status(400).json({
                        message: "Invalid request"
                    })
                    Board.findById(list.board, (error, board) => {
                        if (error) return res.status(400).json({
                            message: "Invalid request"
                        })
                        board.lists = board.lists.filter(function (i) {
                            return !i.equals(list._id)
                        });
                        board.save();
                        return res.status(200).json({
                            message: "List deleted",
                            id: list._id
                        })
                    })
                })
            } else
                return res.status(403).json({
                    message: "You couldn't delete this list"
                });
        })
    })

module.exports = router;