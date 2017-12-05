let express = require("express");
let router = express.Router();
const Project = require('../../models/Project')
const User = require('../../models/User');
var auth = require("./auth");

router.route("/")
    .get( auth.adminCheck, async(req, res, next) => {
        User.find({}, function (err, users) {
            if (err)
                return res.json({
                    message: 'Internal error',
                    success: false
                });
            res.status(200).json({
                users,
                success: true
            });
        })
    });
router.route('/:user_name')
    .get( async(req, res, next) => {
        let user = req.params.user_name;
        User.findOne({"name": user}, function (err, user) {
            if (err || !user)
                return res.json({
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
             //   user,
                success: true
            });
        })
    })
module.exports = router;