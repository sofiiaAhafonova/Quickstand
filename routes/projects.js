let express = require("express");
let router = express.Router();

let storage = require("./../modules/projects");
const onOnePage = 3;
function chunk(a){
    var arrays = [];
    while (a.length > 0)
        arrays.push(a.splice(0, onOnePage));
    return arrays;
}
router.get("/", (req, res, next) => {
    storage.getAll()
        .then(data => {
            let cur = req.query.page;
            let pages = chunk(data);
            let pageNumber = pages.length;
            if (!cur) cur = 1;
            if (cur > pageNumber) {
              res.send(404)
              return
            }
            res.render("projects", { proj_arr: pages[cur - 1], pageNumber})
        }).catch(err => res.sendStatus(500));
});

router.get("/:project_id(\\d+)",
    (req, res) => {
        let id = req.params.project_id;
       storage.getById(id)
        .then(project => res.render("project", {project}),
        err => res.sendStatus(404))
        .catch(err => res.sendStatus(500));
    });
router.post("/:project_id(\\d+)/remove",
    (req, res) => {
        let id = req.params.project_id;
       storage.remove(id)
        .then(project => res.redirect("/projects"))
        .catch(err => res.sendStatus(500));
    });
module.exports = router;