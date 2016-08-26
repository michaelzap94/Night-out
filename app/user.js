var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');


//schema to save bars that user is going to

var goingSchema = mongoose.Schema({
    valueGoing: Number,
    userId:String,
    barName:String,
    displayBarName:String,
    text:String,
    imgUrl:String,
    link:String

    
});
var GoingSchema = mongoose.model("GoingSchema", goingSchema);


// define the schema for our user model
var userSchema = mongoose.Schema({

    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    goingValue:[goingSchema]

});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
var UserSchema = mongoose.model('User', userSchema);
module.exports = {User:UserSchema,GoingSchema:GoingSchema};
