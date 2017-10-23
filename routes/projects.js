let express = require("express");
let router = express.Router();

let storage = require("./../projects");

router.get("/", (req, res, next) => {
    storage.getAll()
        .then(data => res.render("projects", { proj_arr: data}))
        .catch(err => res.sendStatus(500));
});

router.get("/:project_id(\\d+)",
    (req, res) => {
        let id = req.params.project_id;
       storage.getById(id)
        .then(project => res.render("project", {project}),
        err => res.sendStatus(404))
        .catch(err => res.sendStatus(500));
    });

module.exports = router;