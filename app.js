var express = require('express'),
    app = module.exports = express();

const projects = require("./routes/projects");
const project_form = require("./routes/project_form");
const search = require("./routes/search");
const bodyParser = require('body-parser')
const busboyBodyParser = require('busboy-body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const expressValidator = require('express-validator');

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));
//for images
app.use(busboyBodyParser({
    limit: '5mb'
}));

//auth
app.use(cookieParser());
app.use(session({
	secret: "Some_secret^string",
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator());


//database
//Import the mongoose module
var mongoose = require('mongoose');

// database
mongoose.connect("mongodb://Tester:test@ds261755.mlab.com:61755/quickstand", {
    useMongoClient: true
  })
  mongoose.Promise = global.Promise
  let db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error:'))
  db.once('open', function () {
    console.log('Connected to mongodb successfully.')
  })
app.get("/", (req, res) => {
    try {
        res.render("index", {});
    } catch (error) {
        res.send(error.message);
    }
});

app.use("/projects", projects);
app.use("/project_form", project_form);
app.use("/search", search);

app.listen(8080, () => console.log("UP!"));