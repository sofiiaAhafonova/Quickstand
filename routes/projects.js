let express = require("express");
let router = express.Router();
const Project = require('../models/Project')
const User = require('../models/User');
const onOnePage = 3;

function chunk(a) {
    var arrays = [];
    while (a.length > 0)
        arrays.push(a.splice(0, onOnePage));
    return arrays;
}
router.get("/", (req, res, next) => {
    Project.find({
            "access": "Public"
        })
        .then(data => {
            let cur = req.query.page;
            let pages = chunk(data);
            let pageNumber = pages.length;
            if (!cur) cur = 1;
            if (cur > pageNumber && pageNumber) {
                res.sendStatus(404)
                return
            }
            res.render("projects", {
                title: "Public Projects",
                proj_arr: pages[cur - 1],
                pageNumber,
                user: req.user,
                ref: "/projects/"
            })
        });
});
router.get("/personal", (req, res, next) => {
    Project.find({
            "_id": {
                $in: req.user.projects
            }
        })
        .then(data => {
            let cur = req.query.page;
            let pages = chunk(data);
            let pageNumber = pages.length;
            if (!cur) cur = 1;
            if (cur > pageNumber && pageNumber) {
                res.sendStatus(404)
                return
            }
            res.render("projects", {
                title: "Personal Projects",
                proj_arr: pages[cur - 1],
                pageNumber,
                user: req.user,
                ref: "/projects/"
            })
        });
});

router.get("/:project_id",
    (req, res, next) => {
        let id = req.params.project_id;
        Project.findById(id, function (error, project) {
            if (error)
                console.log(error.message);
            if (!project)
                return next();
            res.render("project", {
                project,
                user: req.user
            })
        })
    });
router.post("/:project_id/remove",
    (req, res, next) => {
        let id = req.params.project_id;
        if (req.user.projects.find(el => el == id)) {
            Project.findByIdAndRemove(id,
                function (err, project) {
                    if (err)
                        console.log(err.message);
                    if (!project)
                        return next();
                    res.redirect("/projects");
                })
        };
    });
module.exports = router;