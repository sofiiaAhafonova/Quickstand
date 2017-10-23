var express = require('express')
, app = module.exports = express();

app.set("view engine", "ejs");
const projects = require("./routes/projects");
app.use(express.static("public"));

app.get("/", (req, res) => {
    try {
          res.render("index",{});
    }
    catch(error) {
        res.send(error.message);   
    }
});

app.use("/projects", projects);

let storage = require("./projects");
app.listen(8080, () => console.log("UP!"));

