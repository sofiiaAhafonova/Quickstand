let express = require("express");
let router = express.Router();
let storage = require("./../modules/projects");
const fs = require("fs-promise");
const Project = require('../models/Project')
router.get("/", (req, res, next) => {
    storage.getAll()
        .then(data => res.render("project_form", {errors:null}))
        .catch(err => res.sendStatus(500));
});

router.post('/post_enctype.asp', function(req, res){
    if(!req.body) return res.sendStatus(400);

    let logo = req.files.logo;
    let type ="." + logo.mimetype.substring(6);
    let base64String = logo.data.toString('base64');
    Project.create({    
        name : req.body.projName,
        description : req.body.projDescription,
        status : req.body.projStatus,
        team :  req.body.teamName,
        man_hour :  req.body.manhour,
        rating :  req.body.projRating,
        start_date :  req.body.startDate,
        finish_date :  req.body.finishDate,
        image : base64String},
        function (err, new_proj) {
            if (err) return console.log(err);
            // saved!
            console.log(new_proj);
            res.redirect( "/projects");
          });
    // console.log(new_proj);
    // if(errors) {
    //     res.render('project_form', {errors: errors});
    // } else {
    //     new_proj.save(function (err) {
    //         if (err) return console.log(err);
            
    //     }); 
        // storage.getAll()
        //     .then(arr => arr.findIndex(pr => pr.name == new_proj.name) != -1)
        //     .then(ex =>{
        //         if (ex)
        //                 res.render('project_form', {errors: ["Project with this name exists"]});
        //         else
        //             storage.create(new_proj)
        //                 .then(() => fs.writeFile("public/images/" + new_proj.name + type,new Buffer(base64String, 'base64')))
        //                 .then(() => res.redirect( "/projects/" +  new_proj.id))
        //         })
        
       
    

   

 });
module.exports = router;