let express = require("express");
let router = express.Router();
const Project = require('../../models/Project')
const User = require('../../models/User');
const Task = require('../../models/Task');
const Board = require('../../models/Board');
const TaskList = require('../../models/List');
var auth = require("./auth");
const projects = require('./projects');
const users = require('./users');
const tasks = require('./tasks');
const boards = require('./boards');


router.get('/', function (req, res) {
    res.json({
        message: 'hooray! welcome to our api!',
        success: false
    });
});
router.use('/projects', auth.authCheck, projects);
router.use('/users', auth.authCheck, users);
router.use('/tasks', auth.authCheck, tasks);
router.use('/boards', auth.authCheck, boards);
router.use(function (req, res) {
    return res.status(400).json({
        message: "404: Not found",
        success: false
    });
});

router.use(function (err, req, res, next) {
    console.log(err);
    return res.status(500).json({
        message: '500: Internal Server Error',
        success: false
    });
});
module.exports = router;