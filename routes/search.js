let express = require("express");
let router = express.Router();

const Project = require('../models/Project')



router.get("/", (req, res) => {
    let search_name = req.query.searchedName.toLowerCase();
    Project.find({
            name: {
                $gte: search_name
            }
        })
        .then(data => res.render("search", {
            proj_arr: data
        }))
        .catch(err => res.sendStatus(500));
});


module.exports = router;