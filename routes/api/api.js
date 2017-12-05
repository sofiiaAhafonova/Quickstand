let express = require("express");
let router = express.Router();
const Project = require('../../models/Project')
const User = require('../../models/User');
var auth = require("./auth");
const projects = require('./projects')
const users = require('./users')

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});
router.use('/projects', auth.authCheck, projects);
router.use('/users',auth.authCheck, users)

module.exports = router;