//required initial packages
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var passport = require('passport');
var expressSession = require("express-session");

//DB
var dburl = process.env.DATABASEURL || "mongodb://localhost/nigthout";
mongoose.connect(dburl);




require('./config/passport')(passport); // pass passport for configuration



// configuration ===============================================================


app.configure(function() {

	app.use(express.logger('dev'));
    app.use(express.cookieParser()); 
	app.use(express.bodyParser());
    app.use(bodyParser.urlencoded({extended:true}));
    app.set("view engine", "ejs");
    app.use(express.static(__dirname + "/public"));
    app.use(methodOverride("_method"));

    	// required for passport
    //WE NEED THIS LINES FOR SESSIONS
    app.use(expressSession({
        secret:"I am a full stack developer",
        resave:false,
        saveUninitialized:false
    }));
    app.use(passport.initialize());
    app.use(passport.session());

	app.use(flash()); 
});


//EVERY FUNCTION USED IN app.use WILL BE USED IN EVERY SINGLE ROUTE.
//req.user is included in Passport package and
//-indicates current user, if none then null.
app.use(function(req,res,next){
    res.locals.currentUser = req.user;// req.locals will pass currentUser to every ejs as variable.(in this case header.ejs)
    next(); // we need next() to move to the next middleware.
    
});

//pass a variable for every ejs to use it(error,success)
//it's a key/value map, where "error" and "success in this file are the keys
app.use(function(req,res,next){
    res.locals.error = req.flash("error");// req.locals will pass currentUser to every ejs as variable.(in this case header.ejs)
       res.locals.success = req.flash("success");// req.locals will pass currentUser to every ejs as variable.(in this case header.ejs)

    next(); // we need next() to move to the next middleware.
    
});

app.use(function(req,res,next){
                res.locals.searchIsCalled = false;// req.locals will pass currentUser to every ejs as variable.(in this case header.ejs)
                next(); // we need next() to move to the next middleware.
    
                });

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The App Server Has Started!");
});