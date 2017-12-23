let express = require("express");
let router = express.Router();
const Project = require('../models/Project')
const User = require('../models/User');
const Board = require('../models/Board');
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
router.get("/personal", checkAuth, (req, res, next) => {
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
            Board.find({
                    "project": project._id
                }, (err, boards) => {
                    if (err)
                        return next();
                    res.render("project", {
                            project,
                            user: req.user,
                            boards
                        })
                })
        })
    });
router.post("/:project_id/remove", checkAuth,
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


router.route("/:project_id")
    .post(checkAuth,async function (req, res, next){
        let name =req.body.name;
        let id = req.params.project_id;
        Project.findById(id, (err, project)=>{
            if(err || !project)
            {
                console.log(err)
                return;
            }
            let requser;
            if(req.user) requser= req.user._id
            if (requser && requser.equals(project.user))
            {
                Board.create({
                    name,
                    project: project._id,
                    user: project.user
                },
                function (err, board) {
                    if (err){
                        console.log(err);
                        return next()
                    }
                    project.boards.push(board._id);
                    project.save((err, project) => {
                        if (err)
                            console.log(err);
                    });
                    return res.redirect('/boards/'+ board._id)
                })
            }else
            return res.status(403).render('error_page',{
                    user: req.user,
                    message: "You couldn't create board here"
                });
            
        })
    })    
function checkAuth(req, res, next) {
        if (req.isAuthenticated()) return next();
        return res.redirect('/register/login');
}
module.exports = router;