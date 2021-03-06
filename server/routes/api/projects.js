let express = require("express");
let router = express.Router();
const Project = require('../../models/Project');
const User = require('../../models/User');
const Board = require('../../models/Board');
let _ = require("underscore");
var cloudinary = require('cloudinary');


 function checkProject(req, res) {
     return new Promise(function(resolve, reject) {
        let id = req.params.project_id;
        Project.findById(id, function (error, project) {
            if (error)
                console.log(error.message);
            if (!project)
                return reject({
                    message: 'Not found',
                    status: 404
                })
            let requser = res.locals.user._id;
            let owner = project.user;
            if (requser.equals(owner) || project.access == "Public")
                return resolve(
                    project
                );
            else
                return reject({
                    message: "You couldn't view this project",
                    status: 403
                });
        })         
     })
}
cloudinary.config({
    cloud_name: 'de46jchnd',
    api_key: '365483611972472',
    api_secret: 'WDcwHCjlZvJWHdDaFr9fjRRNv-k'

});

const validFieldsForUpdate = ['name', 'description', 'image', 'rating', 
    "start_date", "finish_date", "man_hour", "access", "status"
]

router.route("/")
    .get(async function (req, res) {
        var docsPerPage = 3;
        var pageNumber = 1;
        if (!req.query.page)
            pageNumber = 1;
        else
            pageNumber = req.query.page;
        if (pageNumber < 1) {
            return res.status(400).json({
                message: "Wrong page number",
                success: false
            });
        }
        let search_name = req.query.name;
        Project.findPaginated({
            name: {
                $regex: new RegExp(search_name, "i")
            },
            "access": "Public"
        }, function (err, projects) {
            if (projects.documents.length == 0)
                return res.status(200).json({
                    message: "Nothing was found",
                    success: true
                });
            if (pageNumber > projects.totalPages) {
                return res.status(400).json({
                    message: "Wrong page number",
                    success: false
                });
            }
            let nextPage = (projects.nextPage > 0) ? projects.nextPage : "none";
            let prevPage = (projects.prevPage > 0) ? projects.prevPage : "none";
            res.json({
                success: true,
                projects: projects.documents,
                totalPages: projects.totalPages,
                nextPage,
                prevPage
            });

        }, docsPerPage, pageNumber);
    })
    .post(async(req, res) => {

        let fields = _.pick(req.body, validFieldsForUpdate);
        fields.user = res.locals.user._id;
        if (req.files.image)
            fields.image = "http://res.cloudinary.com/de46jchnd/image/upload/v1512598615/" + fields.name + ".jpg";
        Project.create(
            fields
        ).then((project) => {
            res.locals.user.projects.push(project._id);
            res.locals.user.save().then().catch(err => console.log(err));
            cloudinary.uploader.upload_stream(function (result) {
                console.log(result);
            }, {
                public_id: project.name
            }).end((req.files.image.data));
            return res.json({
                message: 'Project created!',
                project: project._id,
                success: true
            });
        }).catch(err => {
            return res.status(400).json({
                message: err.message,
                success: false
            });
        })
    })
router.route("/:project_id")
    .get(
        async (req, res, next) => {
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
                    return res.status(403)
                        .json({
                            message: "You couldn't view this project",
                            success: false
                        });
            })
        })
    .put(async(req, res) => {
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
    .delete(async(req, res, next) => {
        let id = req.params.project_id;
        if (res.locals.user.projects.find(el => el == id) || res.locals.user.role == "admin") {
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
router.route("/:project_id/boards")
    .get(async function (req, res) {
        checkProject(req, res)
            .then(
                (project) => {
                    Board.find({
                        "project": project._id
                    }, (err, boards) => {
                        if (err)
                            return res.status(400).json({
                                message: 'Invalid request'
                            });
                        if (!boards)
                            return res.status(200).json({
                                message: 'No boards were found'
                            });
                        res.status(200).json({
                            boards
                        });
                    })
                },
                (rej) => res.status(rej.status).json({
                    message: rej.message
                })
            )

    })
module.exports = router;