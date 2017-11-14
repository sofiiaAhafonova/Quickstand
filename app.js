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
//Import the mongoose module
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//Set up default mongoose connection
var mongoDB = 'mongodb://Amita:qwerty@ds261755.mlab.com:61755/quickstand';
mongoose.connect(mongoDB, {
  useMongoClient: true
});
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

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

