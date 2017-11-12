var express = require('express')
, app = module.exports = express();

app.set("view engine", "ejs");
const projects = require("./routes/projects");
const project_form = require("./routes/project_form");
const search = require("./routes/search");
var bodyParser = require('body-parser')
const busboyBodyParser = require('busboy-body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
//for images
app.use(busboyBodyParser({ limit: '5mb' }));
//validator
var expressValidator = require('express-validator');
app.use(expressValidator());


//database
let mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI, {
  useMongoClient: true
});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to mongodb successfully.');
})

app.get("/", (req, res) => {
    try {
          res.render("index",{});
    }
    catch(error) {
        res.send(error.message);   
    }
});

app.use("/projects", projects);
app.use("/project_form", project_form);
app.use("/search", search);

app.listen(8080, () => console.log("UP!"));

