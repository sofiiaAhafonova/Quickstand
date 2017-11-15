let express = require("express");
let router = express.Router();

const fs = require("fs-promise");
var Project = require('../models/Project');
router.get("/", (req, res, next) => {
    try {
        res.render("project_form", {
            errors: "",
            flag: false
        })
    } catch (err) {
        res.sendStatus(500);
    }
});

router.post("/", function (req, res) {
    if (!req.body) return res.sendStatus(400);
    Project.create({
                name: req.body.projName,
                description: req.body.projDescription,
                status: req.body.projStatus,
                team: req.body.teamName,
                man_hour: req.body.manhour,
                rating: req.body.projRating,
                start_date: req.body.startDate,
                finish_date: req.body.finishDate,
                image: req.files.logo.data
            },
            function (err) {
                if (err)
                    return res.sendStatus(404)
                console.log("added");
            }
        )
        .then(() => res.redirect("/projects"))
        .catch((error) => res.render("error_page.ejs", {
            errors: error
        }))

});
module.exports = router;