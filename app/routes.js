var yelpInfo = require("./yelpInfo");
var Schemas = require("./user.js");
var User = Schemas.User;
var GoingSchema = Schemas.GoingSchema;
module.exports = function(app, passport) {


    // route for home page
    app.get('/',  function(req, res) {
        res.render('home.ejs'); 
    });

     function searchMiddleware(req,res,next){
                res.locals.searchIsCalled = true;// req.locals will pass currentUser to every ejs as variable.(in this case header.ejs)
                next(); // we need next() to move to the next middleware.
    
                
    }
        
   // route for showing the home page with your last Search
    app.get('/home', isLoggedIn, searchMiddleware,function(req, res) {
                
                res.render('home.ejs');
               
    });
    
     // route for showing the home page with your last Search
    app.get('/going', isLoggedIn,function(req, res) {
       
                res.render("going.ejs");
    });
    
    app.get("/location",function(req,res){
       var term = req.query.term || "pub"; // gets the term from the search input box
       var radius = req.query.radius || 30000;
       
        yelpInfo(req,res,term,radius);
    });

 app.post("/deletegoing",isLoggedIn,function(req,res){
     User.findById(req.user.id,function(error,user){
           if(error){
           
               console.log("data could not be deleted");
           }
           else{
               
              for(var i =0;i<user.goingValue.length;i++){
                  
                   if(user.goingValue[i].barName===req.body.barName){
                      user.goingValue.splice(i,1);
                        user.save(function(err, user){
                            if(err){
                                console.log(err);
                            } else {
                                console.log("user goingValue saved");
                                res.send(user);
                            }
                        });
              
                   }}}});
        
        
    });

    app.post("/sentform",isLoggedIn,function(req,res){
        console.log(req.body);
        User.findById(req.user.id,function(error,user){
           if(error){
           
               console.log("data could not be stored");
           }
           else{
               
            if(user.goingValue.length<0){
              for(var i =0;i<user.goingValue.length;i++){
                  
                   if(user.goingValue[i].userId===req.body.userId){
                       res.send(user);
              
                   }else{
                            user.goingValue.push({  //USE THE DATA RETURNED TO PUSH NEW DATA INTO IT AND SAVE IT TOO
                            valueGoing: req.body.valueGoing,
                            userId: req.body.userId,
                            barName: req.body.barName,
                            displayBarName:req.body.displayBarName,
                            text:req.body.text,
                            imgUrl:req.body.imgUrl,
                            link:req.body.link
                        });
                        user.save(function(err, user){
                            if(err){
                                console.log(err);
                            } else {
                                console.log("user goingValue saved");
                                res.send(user);
                            }
                        });
                 
      
                   }
                  
              }
            }else{
                user.goingValue.push({  //USE THE DATA RETURNED TO PUSH NEW DATA INTO IT AND SAVE IT TOO
                            valueGoing: req.body.valueGoing,
                            userId: req.body.userId,
                            barName: req.body.barName,
                            displayBarName:req.body.displayBarName,
                            text:req.body.text,
                            imgUrl:req.body.imgUrl,
                            link:req.body.link
                        });
                        user.save(function(err, user){
                            if(err){
                                console.log(err);
                            } else {
                                console.log("user goingValue saved");
                                res.send(user);
                            }
                        });
            }
              
           }
        });
        
        
        
    });


        // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    /** TWITTER AUTHENTICATION
     */
    // route for twitter authentication and login
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/home',
            failureRedirect : '/'
        }));

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}