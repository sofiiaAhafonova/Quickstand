let express = require("express");
let router = express.Router();
const Project = require('../../models/Project')
const User = require('../../models/User');
var auth = require("./auth");
let _ = require("underscore");

const validFieldsForUpdate = ['name', 'description', 'image', 'rating', "team",
    "start_date", "finish_date", "man_hour", "access", "status"
]

router.route("/")
    .get(function (req, res) {
        Project.find({
            "access": "Public"
        }, function (err, projects) {
            if (err)
                return res.send(err);
            res.json(projects);
        });
    })
    .post((req, res) => {

        let fields = _.pick(req.body, validFieldsForUpdate);
        fields.user = res.locals.user._id;
        if (req.files.image)
            fields.image = req.files.image.data;
        Project.create(
            fields
        ).then((project) => {
            res.locals.user.projects.push(project._id);
            console.log(project.image);
            res.locals.user.save().then().catch(err => console.log(err));
            return res.json({
                message: 'Project created!',
                success: true
            });
        }).catch(err => {
            return res.json({
                message: err.message,
                success: false
            });
        })
    })
router.route("/:project_id")
    .get(
        (req, res, next) => {
            let id = req.params.project_id;
            Project.findById(id, function (error, project) {
                if (error)
                    console.log(error.message);
                if (!project)
                    return res.status(404)
                        .json({
                            message: 'Not found',
                            success: false
                        })
                let requser = res.locals.user._id;
                let owner = project.user;
                if (requser.equals(owner) || project.access == "Public")
                    return res.json({
                        success: true,
                        project
                    });
                else
                    return res.status(401)
                        .json({
                            message: "You couldn't view this project",
                            success: false
                        })
            })
        })
    .put((req, res) => {
        let id = req.params.project_id;
        Project.findById(id, function (err, project) {
            if (err || !project)
                return res.status(404).json({
                    message: 'Not found!',
                    success: false
                });
            let requser = res.locals.user._id;
            let owner = project.user;
            if (!requser.equals(owner))
                return res.status(403).json({
                    message: 'Access denied',
                    success: false
                });
            let fields = _.pick(req.body, validFieldsForUpdate);
            if (req.files.image)
                fields.image = req.files.image.data;
            project.set(fields);
            project.save(function (err) {
                if (err)
                    return res.json({
                        message: err.message,
                        success: false
                    })

                return res.json({
                    message: 'Project updated!',
                    success: true
                });
            });
        })
    })
    .delete((req, res, next) => {
        let id = req.params.project_id;
        if (res.locals.user.projects.find(el => el == id)) {
            Project.findByIdAndRemove(id,
                function (err, project) {
                    if (err)
                        console.log(err.message);
                    if (!project)
                        return res.status(404).json({
                            message: 'Not found',
                            success: false
                        });
                    res.locals.user.projects = res.locals.user.projects.filter(el => {
                        if (!el.equals(project._id))
                            return el;
                    })
                    res.locals.user.save();
                    return res.status(200).json({
                        message: 'Project removed!',
                        success: true
                    });
                })
        } else
            return res.status(403).json({
                message: 'Access denied',
                success: false
            });
    })
module.exports = router;