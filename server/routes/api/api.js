let express = require("express");
let router = express.Router();
const Project = require('../../models/Project')
const User = require('../../models/User');
const Task = require('../../models/Task');
const Board = require('../../models/Board');
const List = require('../../models/List');
const projects = require('./projects');
const users = require('./users');
const tasks = require('./tasks');
const boards = require('./boards');
const lists = require('./lists');
const auth_check = require('../../middleware/auth-check');

router.get('/', function (req, res) {
    res.json({
        message: 'hooray! welcome to our api!',
        success: false
    });
});
router.get('/auth/admin', auth_check, function (req, res) {
    let admin = (res.locals.user.role == 'admin')? true : false;
    res.json({
        isAdmin: admin,
    });
});
router.use('/projects', auth_check, projects);
router.use('/users',auth_check, users);
router.use('/tasks', auth_check, tasks);
router.use('/boards',auth_check, boards);
router.use('/lists', auth_check, lists);

router.use(function (req, res) {
    return res.status(400).json({
        message: "404: Not found"
    });
});

router.use(function (err, req, res, next) {
    console.log(err);
    return res.status(500).json({
        message: '500: Internal Server Error'
    });
});
module.exports = router;