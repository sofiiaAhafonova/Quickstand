let express = require("express");
let router = express.Router();
const User = require('../models/User');
const fs = require("fs-promise");
var Project = require('../models/Project');
var cloudinary = require('cloudinary');

router.get("/", (req, res, next) => {
    try {
        res.render("project_form", {
            error: "",
            flag: false,
            user: req.user
        })
    } catch (err) {
        res.sendStatus(500);
    }
});

router.post("/", function (req, res, next) {
    if (!req.body) {
        console.log(req.body)
        return res.sendStatus(400);
    }
    let proj = req.body;
    proj.user =  req.user._id;
    proj.image = req.files.logo.data
    Project.create({
               proj
            },
            function (err, doc) {
                if (err)
                {
                    console.log(err)
                    res.redirect('/project_form');
                 
                    return;
                }
                   
                console.log("added");
                req.user.projects.push(doc._id);
                req.user.save();
            }
        )
        .then(() => res.redirect("/projects"))
        .catch((error) => res.render("error_page.ejs", {
            errors: error
        }))

});
module.exports = router;