let express = require("express");
let router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project')
var path = require('path');

router.get("/", async(req, res, next) => {
  let search_name = req.query.name;
  res.cookie('searchValue', search_name)
  res.sendFile(path.join(__dirname + '/../views/search.html'));
   
});


module.exports = router;