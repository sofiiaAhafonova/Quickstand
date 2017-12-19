let express = require("express");
let router = express.Router();
const Project = require('../../models/Project')
const User = require('../../models/User');
const Task = require('../../models/Task');
const project = require('./projects');
router.route("/:project_id")
    .get(function (req, res) {
        var docsPerPage = 3;
        var pageNumber = 1;
        if (!req.query.page)
            pageNumber = 1;
        else
            pageNumber = req.query.page;
        if ( pageNumber < 1) {
            return res.status(400).json({
                message: "Wrong page number",
                success: false
            });
        }
        let search_name = req.query.name;
        Task.findPaginated({
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



module.exports = router;