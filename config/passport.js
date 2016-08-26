var LocalStrategy    = require('passport-local').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;

// load the user model
var User  = require('../app/user').User;

module.exports = function(passport) {

    //serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    //deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
 
    passport.use(new TwitterStrategy({

        consumerKey     : process.env.CONSUMERKEY,
        consumerSecret  : process.env.CONSUMERSECRET,
        callbackURL     : 'https://fcc-back-end-2-michaelzap94.c9users.io/auth/twitter/callback'

    },
    function(token, tokenSecret, profile, done) {

      
        process.nextTick(function() {

            User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

                if (err)
                    return done(err);

             
                if (user) {
                    return done(null, user); 
                } else {
                    var newUser                 = new User();

                    newUser.twitter.id          = profile.id;
                    newUser.twitter.token       = token;
                    newUser.twitter.username    = profile.username;
                    newUser.twitter.displayName = profile.displayName;

                    // save user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });

    });

    }));

};

