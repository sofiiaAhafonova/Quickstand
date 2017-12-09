let express = require("express");
let router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project')
var path = require('path');


router.get("/", (req, res, next) => {

  res.sendFile(path.join(__dirname + '/../public/search.html'));
   
});


module.exports = router;