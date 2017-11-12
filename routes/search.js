let express = require("express");
let router = express.Router();

let storage = require("./../modules/projects");


router.get("/", (req, res) => {
    let search_name = req.query.searchedName.toLowerCase();
    storage.getAll()
    .then(proj_arr => proj_arr.filter(cur => cur.name.toLowerCase().indexOf(search_name) >= 0 ))
    .then(data => res.render("search", { proj_arr: data}))
    .catch(err => res.sendStatus(500));
});


module.exports = router;