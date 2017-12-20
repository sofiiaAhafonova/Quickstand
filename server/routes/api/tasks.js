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
            list
        } = req.body;
        let requser = res.locals.user._id;
        List.findById(list, (err, lst) => {
            if (err)
                console.log(err);
            if (err || !lst)
                return res.status(400).json({
                    message: "Wrong list id"
                });
            if (requser.equals(lst.user)) {
                Task.create({
                        name,
                        list: lst._id,
                        board: lst.board,
                        project: lst.project,
                        user: requser
                    },
                    function (err, task) {
                        if (err) return res.status(400).json({
                            message: err.message
                        });
                        lst.tasks.push(task._id);
                        lst.save((err) => {
                            if (err)
                                console.log(err);
                        });
                        res.status(200).json({
                            message: 'Task created!',
                            task_id: task._id
                        })
                    })
            }
        })
    })


router.route("/:task_id")
    .get(function asynk(req, res) {
        let id = req.params.task_id;
        Task.findById(id, (err, task) => {
            if (err)
                return res.status(400).json({
                    message: "Invalid request"
                });
            if (!task)
                return res.status(404).json({
                    message: "No tasks were found"
                });
            let requser = res.locals.user._id;
            if (requser.equals(task.user))
                return res.status(200).json({
                    task
                })
            else
                return res.status(403).json({
                    message: "You couldn't view this task"
                });
        })
    })
    .put(function asynk(req, res) {
        let id = req.params.task_id;
        const {
            name,
            list
        } = req.body;
        Task.findById(id, (err, task) => {
            if (err)
                return res.status(400).json({
                    message: "Invalid request"
                });
            if (!task)
                return res.status(404).json({
                    message: "No tasks were found"
                });
            let requser = res.locals.user._id;
            if (requser.equals(task.user)) {
                if (name) task.name = name;
                task.save((err) => {
                    if (err) return res.status(400).json({
                        message: "Invalid request"
                    })
                    return res.status(200).json({
                        message: "Task updated",
                        id: task._id
                    })
                })
            } else
                return res.status(403).json({
                    message: "You couldn't update this task"
                });
        })

    })
    .delete(function asynk(req, res) {
        let id = req.params.task_id;
        Task.findById(id, (err, task) => {
            if (err)
                return res.status(400).json({
                    message: "Invalid request"
                });
            if (!task)
                return res.status(404).json({
                    message: "No tasks were found"
                });
            let requser = res.locals.user._id;
            if (requser.equals(task.user)) {
                task.remove((err) => {
                    if (err) return res.status(400).json({
                        message: "Invalid request"
                    })
                    List.findById(task.list, (error, list) => {
                        if (error) return res.status(400).json({
                            message: "Invalid request"
                        })
                        list.tasks = list.tasks.filter(function (i) {
                            return !i.equals(task._id)
                        });
                        list.save();
                        return res.status(200).json({
                            message: "Task deleted",
                            id: task._id
                        })
                    })
                })
            } else
                return res.status(403).json({
                    message: "You couldn't delete this task"
                });
        })
    })

module.exports = router;