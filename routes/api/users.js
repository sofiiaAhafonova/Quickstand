let express = require("express");
let router = express.Router();
const Project = require('../../models/Project')
const User = require('../../models/User');
var auth = require("./auth");

router.route("/")
    .get(auth.adminCheck, async(req, res, next) => {
        var docsPerPage = 3;
        var pageNumber = 1;
        if (!req.query.page)
            pageNumber = 1;
        else
            pageNumber = req.query.page;
        if (!Number.isInteger(Number.parseInt(pageNumber)) || pageNumber < 1) {
            return res.status(400).json({
                message: "Wrong page number",
                success: false
            });
        }
        User.findPaginated({}, function (err, users) {
            if (err)
                return res.status(400).json({
                    message: 'Bad request error',
                    success: false
                });
            if (!users)
                return res.status(400).json({
                    message: 'Opps! There are no users in DB',
                    success: true
            });
            let nextPage = (users.nextPage > 0) ? users.nextPage : "none";
            let prevPage = (users.prevPage > 0) ? users.prevPage : "none";
            res.status(200).json({
                success: true,
                users: users.documents,
                totalPages: users.totalPages,
                nextPage,
                prevPage
            });
        }, docsPerPage, pageNumber)
    });

router.route('/:user_name')
    .get(async(req, res, next) => {
        let user = req.params.user_name;
        User.findOne({
            "name": user
        }, function (err, user) {
            if (err)
            return res.status(400).json({
                message: err.message,
                success: false
            });
            if (!user)
                return res.status(200).json({
                    message: 'Not found',
                    success: false
                });
            res.status(200).json({
                user: {
                    "name": user.name,
                    "role": user.role,
                    "email": user.email,
                    "projects": user.projects
                },
                success: true
            });
        })
    })
module.exports = router;