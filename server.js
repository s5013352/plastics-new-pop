// server.js

// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

var pg = require('./pgSetup');

var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);

var passport = require('./passportSetup');


// configuration ===========================================
    

// set our port
var port = process.env.PORT || 8080; 


// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

// set the static files location /public
app.use(express.static(__dirname + '/public'));

// Session Setup
app.use(session({
    store: new pgSession({ pg : pg }),
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: false
}));

// setup and initialise passport authentication
app.use(passport.initialize());
app.use(passport.session());

// routes ==================================================
var route = require('./routes'); //file 'routes.js' contains all routes

app.use('/',  route); //this makes the app uses the file 'routes.js' for all routing

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);               

// shoutout to the user                     
console.log('Magic happens on port ' + port);

// expose app           
exports = module.exports = app;                         
