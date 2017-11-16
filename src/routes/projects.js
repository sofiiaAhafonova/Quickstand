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
        }) //.catch(err => res.sendStatus(500));
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
        }) //.catch(err => res.sendStatus(500));
});

router.get("/:project_id",
    (req, res) => {
        let id = req.params.project_id;
        Project.findById(id, function (err, project) {
            if (err) {
                res.sendStatus(404);
                return;
            }
            res.render("project", {
                project,
                user: req.user
            })
        }) //.catch(err => res.sendStatus(500));
    });
router.post("/:project_id/remove",
    (req, res) => {
        let id = req.params.project_id;
        Project.findByIdAndRemove(id,
            function (err, project) {
                if (err) {
                    res.sendStatus(404);
                    return;
                }
                res.redirect("/projects");
            }) //.catch(err => res.sendStatus(500));
    });
module.exports = router;