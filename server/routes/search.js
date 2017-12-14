let express = require("express");
let router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project')
var path = require('path');
router.use(express.static(path.join(__dirname,'/../public/dist')));

router.get("/", (req, res, next) => {

  res.sendFile(path.join(__dirname + '/../views/search.html'));
   
});


module.exports = router;