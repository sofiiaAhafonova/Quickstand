let express = require("express");
let router = express.Router();
const Project = require('../models/Project')
const User = require('../models/User');
var auth = require("../../app");

router.use('/projects', auth.checkAuth, projects);
router.use('/users',auth.checkAuth, auth.checkAdmin, users)

module.exports = router;