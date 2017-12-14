let express = require("express");
let router = express.Router();
const Project = require('../../models/Project')
const User = require('../../models/User');
var auth = require("./auth");
const projects = require('./projects')
const users = require('./users')

router.get('/', function (req, res) {
    res.json({
        message: 'hooray! welcome to our api!',
        success: false
    });
});
router.use('/projects', auth.authCheck, projects);
router.use('/users', auth.authCheck, users);

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