var http = require('http');
var oauthSignature= require("oauth-signature");
var request = require('request');
var nonce = require('nonce')();  
var qs = require('querystring');  



function yelpInfo(parentReq,parentRes,searchTerm,radius){
  var own_radius = radius || 30000;
    var ip = parentReq.headers['x-forwarded-for'] || parentReq.connection.remoteAddress;
    
    var optionsLocation = {
      host: 'freegeoip.net',
      path: '/json/'+ip
    };
    
    
    // get option location
    var req = http.get(optionsLocation, function(res) { 
       // Buffer the body entirely for processing as a whole.
          res.setEncoding('utf8');

              res.on('data', function(chunk) {
                    var userLocation = JSON.parse(chunk);
                    //get response from yelp
                    
                      var url = 'http://api.yelp.com/v2/search';
                      var consumerSecret =  process.env.CSYELP ;
                      var tokenSecret = process.env.TOKENSECRETYELP;
                
                    var parameters = {
                        oauth_consumer_key : process.env.OAUTHCONSUMER,
                        oauth_token : process.env.OAUTHTOKEN,
                        oauth_nonce : nonce(),
                        oauth_timestamp : nonce().toString().substr(0,10),
                        oauth_signature_method : 'HMAC-SHA1',
                        oauth_version : '1.0',
                        location: userLocation.city,
                        cc:userLocation.country_code,
                        radius_filter:own_radius,
                        category_filter:"bars",
                        limit:15,
                        term:searchTerm
                    }
                    
                
                  /* Then we call Yelp's Oauth 1.0a server, and it returns a signature */
                  var signature = oauthSignature.generate("GET", url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});
                
                  /* We add the signature to the list of paramters */
                  parameters.oauth_signature = signature;
                
                  /* Then we turn the paramters object, to a query string */
                  var paramURL = qs.stringify(parameters);
                
                  /* Add the query string to the url */
                  var apiURL = url+'?'+paramURL;
                
                 
                    if(parentReq.isAuthenticated()){
                       /* Then we use request to send make the API Request */
                     request(apiURL, function(error, response, body){
                       var bodyObj = JSON.parse(body).businesses;//OBJECT got from Yelp Api.

                        var userObjGoingArr = parentReq.user.goingValue;//the going value(0 or 1) of user stored in database for the LOGGED IN USER.
                    
                    //loop through bodyObj and check if any of its names is === to a barName stored in the database for the LOGGED IN USER.
                      for (var key in bodyObj) {
                        if (bodyObj.hasOwnProperty(key)) {
                            var val = bodyObj[key];
                            
                            for(var i =0;i<userObjGoingArr.length;i++){
                              if(val.id===userObjGoingArr[i].barName){
                                //if true, create a new property "valueGoing" in val(every Object in JSON object bodyObj) 
                                //and set the value of the matching element " userObjGoingArr[i].valueGoing"
                                val.valueGoing = userObjGoingArr[i].valueGoing;
                              }
                             
                            }
                            
                        }
                          
                      }
                          //send the updated object
                          parentRes.send(bodyObj);

                     }); 
                    }else{
                     /* if user is not LOGGED IN then just send UNMODIFIED data requested from the Yelp Api. */
                      request(apiURL, function(error, response, body){
                        var bodyObj = JSON.parse(body).businesses;//OBJECT got from Yelp Api.

                        parentRes.send(bodyObj);
                      });
                    }
                        
                  
                    
                   
                   
                   
        
      })
    });
    
    req.on('error', function(e) {
      console.log('ERROR: ' + e.message);
    });
    
    
  
}

module.exports = yelpInfo;
