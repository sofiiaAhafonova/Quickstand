var express = require('express'),
    app = module.exports = express();
var path = require('path');
const projects = require("./server/routes/projects");
const project_form = require("./server/routes/project_form");
const search = require("./server/routes/search");
const bodyParser = require('body-parser')
const busboyBodyParser = require('busboy-body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');

const register = require('./server/routes/register');
const profile = require('./server/routes/profile');
const admin = require('./server/routes/admin');
const api = require('./server/routes/api/api');
//const error_page = req
const User = require('./server/models/User');
const flash = require('connect-flash');

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static( path.join(__dirname, 'server', 'public')));
app.use(express.static(path.join(__dirname, '../dist')));
app.set('public', path.join(__dirname, 'server', 'public'));
app.set('views', path.join(__dirname, 'server', 'views'));
//for images
app.use(busboyBodyParser({
    limit: '5mb'
}));


//auth
app.use(cookieParser());
app.use(session({
    secret: "where is my mind",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



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
        res.render("index", {
            user: req.user
        });
    } catch (error) {
        res.send(error.message);
    }
});
app.get("/docs/api/v1", (req, res) => {
    res.render("docs", {
        user: req.user
    });
});

// load passport strategies
const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});


passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

let authCheck = require('./server/middleware/auth-check')
function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    return res.redirect('/register/login');
}

function checkAdmin(req, res, next) {
    if (req.user.role === 'admin') return next();

    return res.redirect('/');

}

app.use("/projects", projects);
app.use("/project_form", project_form);
app.use("/search", search);
app.use('/admin', checkAuth, checkAdmin, admin);
app.use('/register', register);
app.use('/profile', checkAuth, profile);
app.use('/api/v1', api);

app.use(function (req, res) {
    res.status(400);
    res.render('error_page', {
        user: req.user,
        message: '404:  Not Found'
    });
});

app.use(function (err, req, res, next) {
    res.status(500);
    console.log(err);
    res.render('error_page', {
        user: req.user,
        message: '500: Internal Server Error',

    });
});


app.listen(8080, () => console.log("UP!"));