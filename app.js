var express = require('express');

var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require('morgan');
var fs = require('fs');
var flash = require('req-flash');

var path = require('path');

var session = require('express-session');
var passport = require('passport');
var Strategy = require('passport-google-oauth2').Strategy;

app.use(bodyParser.json({ limit: '10mb',extended : true }));
app.use(bodyParser.urlencoded({ limit : '10mb',extendede : true }));
app.use(logger('dev'));
app.set('view engine','jade');
app.set('views',path.join(__dirname + '/app/views'));
app.use(cookieParser());

var nodemailer = require('nodemailer');


var dbPath = "mongodb://localhost/mvcdb";

app.use(session({
  name : 'myCookie',
  secret : 'myAppSecret',
  resave : true,
  httpOnly : true,
  saveUninitialized : true,
  cookie : { secure  : false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
db = mongoose.connect(dbPath);

mongoose.connection.once('open',function()
{
   console.log("database is connected successfully");
});

passport.use(new Strategy({
  clientID : '878965640615-94omdvh1ebj6i2jioq14u8g2hqo7jtce.apps.googleusercontent.com',
  clientSecret : '1toKTWjwiyF9hN9P6LW9mSl4',
  callbackURL : 'http://localhost:3000/users/login/facebook/return'
},
 function(accessToken,refreshToken,profile,cb){
   return cb(null,profile);
 }));

passport.serializeUser(function(user,cb){
  cb(null,user);
});

passport.deserializeUser(function(obj,cb){
  cb(null,obj);
});




fs.readdirSync('./app/models').forEach(function(file){
    if(file.indexOf('.js'))
    {
      require('./app/models/'+file);
    }
});

fs.readdirSync('./app/controller').forEach(function(files){
      if(files.indexOf('.js'))
      {
        var route = require('./app/controller/'+files);

        route.controller(app);
      }
});

var auth = require('./middlewares/auth');
//var mongoose = require('mongoose');
var UserModel = mongoose.model('UserModel');
app.use(function(request,response,next){
  if(request.session && request.session.user){
   UserModel.findOne({'email' : request.session.user.email},function(err,result){
      if(result)
      {
        request.session.user = result;
        delete request.session.password;
        next();
      }
      else{

      }
   });
  }


});

/*app.get('/users',function(request,response){
  console.log(request.session);
    response.render('home');
});

 app.get('/users/login/show',function(request,response){

       response.render('login');

 });

app.get('/users/login/facebook',

 passport.authenticate('facebook'));

app.get('/users/login/facebook/return',
   passport.authenticate('facebook', { failureRedirect : '/login/show' }),
   function(request,response){
     console.log(request.session);
      response.render('profile', { user : request.user });
   });

  app.get('/users/profile',require('connect-ensure-login').ensureLoggedIn(),
    function(request,response){
        response.render('profile',{ user : request.user });
    });

   app.get('/users/logout',function(request,response){
     request.logout();
     response.redirect('/');
   });*/

app.listen(3000,function(){
  console.log("app is listening to port 3000");
});
