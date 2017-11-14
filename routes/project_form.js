let express = require("express");
let router = express.Router();
let storage = require("./../modules/projects");
const fs = require("fs-promise");
var Project = require('../models/Project');
router.get("/", (req, res, next) => {
    Project.find({})
        .then(data => res.render("project_form", {errors:"", flag: false}))
        .catch(err => res.sendStatus(500));
});

router.post('/post_enctype.asp', function(req, res){
    if(!req.body) return res.sendStatus(400);

    let logo = req.files.logo;
    let type ="." + logo.mimetype.substring(6);
    let base64String = logo.data.toString('base64');

    let imgPath = "images/" + req.body.projName + type;
    Project.create({    
        name : req.body.projName,
        description : req.body.projDescription,
        status : req.body.projStatus,
        team :  req.body.teamName,
        man_hour :  req.body.manhour,
        rating :  req.body.projRating,
        start_date :  req.body.startDate,
        finish_date :  req.body.finishDate,
        image : imgPath},
        function(err){
           if(err) 
           return console.log(err.errors['name']);
           
           console.log("added");
        }
    ) .then(() => fs.writeFile("public/" + imgPath ,new Buffer(base64String, 'base64')));
    res.redirect( "/projects");

 });
module.exports = router;