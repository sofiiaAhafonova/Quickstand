let express = require("express");
let router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project')



router.get("/", (req, res) => {
    let search_name = req.query.searchedName.toLowerCase();
    Project.find({
            name: {
                $regex: new RegExp(search_name, "i")
            }
        }).where("access", "Public")
        .then(data => res.render("search", {
            proj_arr: data,
            searchedText: search_name,
            user: req.user
        }))
        .catch(err => res.sendStatus(500));
});


module.exports = router;