let express = require("express");
let router = express.Router();
const User = require('../models/User');
const fs = require("fs-promise");
var Project = require('../models/Project');
var cloudinary = require('cloudinary');
let CLOUDINARY_URL = "cloudinary://365483611972472:WDcwHCjlZvJWHdDaFr9fjRRNv-k@de46jchnd"

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
cloudinary.config({
    cloud_name: 'de46jchnd',
    api_key: '365483611972472',
    api_secret: 'WDcwHCjlZvJWHdDaFr9fjRRNv-k'

});
router.post("/", function (req, res, next) {
    if (!req.body) {
        console.log(req.body)
        return res.sendStatus(400);
    }
    let proj = req.body;
    proj.user = req.user._id;
    let name_img =  proj.name
    cloudinary.uploader.upload_stream(function (result) {
        console.log(result);
    }, {
        public_id:name_img
    }).end((req.files.logo.data));
    proj.image = "http://res.cloudinary.com/de46jchnd/image/upload/v1512598615/" + proj.name + ".jpg";
    Project.create(
            proj,
            function (err, doc) {
                if (err) {
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