
var express = require('express');

var app = express();

var mongoose = require('mongoose');

var UserRoute = express.Router();

var UserModel = mongoose.model('UserModel');

var responseGenerator = require('./../../libs/generateResponse.js');

var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;

var nodemailer = require('nodemailer');

var productModel = mongoose.model('productSchema')
var flash = require('req-flash');
app.use(flash());
module.exports.controller = function(app){

    UserRoute.get('/',function(request,response){
     //console.log(request.session);
       response.render('home');
   });

    UserRoute.get('/login/show',function(request,response){

          response.render('login');

    });

    UserRoute.get('/signup/show',function(request,response){

         response.render('signup');

    });

    UserRoute.get('/forgotpassword/show',function(request,response){
        response.render('forgotpassword');
    });

    UserRoute.post('/forgotpassword',function(request,response){
         //var email = request.body.email;
           var pass = request.body.password;
           var repass = request.body.repassword;

           if(pass!=repass){
             /*request.flash('errorMessage','Password MisMatch');
             response.send(request.flash());*/
               //response.render('forgotpassword',{ alert : request.flash("Password Mismatch") })
           }
           else {

             UserModel.findOneAndUpdate({'email' : request.body.email },pass,function(err,res){
                 if(err){
                   var myResponse = responseGenerator.generateResponse(true,"some error"+err,500,null);
                   response.send(myResponse);
                 }
                 else {
                   response.redirect('/users/login/show');

                 }

             });

           }


         /*let transporter = nodemailer.createTransport({
           service : 'gmail',
           secure : false,
           port : 25,
           auth : {
             user : 'ganeshmani009@gmail.com',
             pass : 'Sridevi!23789'
           },
           tls : {
             rejectUnauthorized : false
           }

         });

         let HelperOptions = {
             from : 'GaneshMani',
             to : email,
             subject : 'Hello World!',
             text : 'it is working'
         };
         transporter.sendMail(HelperOptions,(err,info) => {
           if(err)
           {
              console.log(err);
           }
           else {
               console.log(info);
           }
         });*/
    });

     UserRoute.post('/signup',function(request,response){
          if(request.body.firstName !=null && request.body.lastName!=null && request.body.email !=null && request.body.password !=null)
          {
            var newUser = new UserModel({
                 userName : request.body.firstName+''+request.body.lastName,
                 email : request.body.email,
                 password : request.body.password,
                 Address : request.body.address

            });

            newUser.save(function(err){
               if(err)
               {
                  var myResponse = responseGenerator.generateResponse(true,"some error"+err,500,null);
                  response.send(myResponse);
               }
               else {

                   /*var myResponse =  responseGenerator.generateResponse(false,"successfully signed up",200,newUser);
                   response.send(myResponse);*/
                   request.session.user = newUser;
                   delete request.session.user.password;
                   response.redirect('/users/dashboard');
                  //response.render('dashboard', {user : newUser});
                   /*var myResponse =  responseGenerator.generateResponse(false,"successfully signed up",200,newUser);
                   response.send(myResponse);*/

               }

            })

          }
          else {
             var errResponse = {
               error : true,
               message : "some parameters are missing",
               status : 404,
               data : null
             }
             response.send(errResponse);
          }
     });

    //dashboard module
    UserRoute.get('/dashboard',function(request,response){
        console.log(request.session);
        response.render('dashboard',{ user : request.session.user });
    });

    UserRoute.get('/login/facebook',

     passport.authenticate('google', { scope : ['profile','email'] } ));

    UserRoute.get('/login/facebook/return',
       passport.authenticate('google', { failureRedirect : '/login/show' }),
       function(request,response){
         console.log(request.session);
         productModel.find({},function(error,result){
             if(err)
             {
               var myResponse = responseGenerator.generateResponse(true,"some error occured"+error,500,null);
               response.send(myResponse);
             }
             else {
               console.log(result);
            response.render('product_view', { "product" : result,"user" : request.user });
          }
        });
          //response.render('profile', { user : request.user });
       });

      UserRoute.get('/profile',require('connect-ensure-login').ensureLoggedIn(),
        function(request,response){
          console.log(request.session);
            response.render('profile',{ user : request.user });
        });

       UserRoute.get('/logout',function(request,response){
         request.logout();
         response.redirect('/users');
       });

     //login module
     UserRoute.post('/login',function(request,response){
             UserModel.findOne({$and : [{ email : request.body.email },{ password : request.body.password }]},function(err,result){
                console.log(result);
                if(err)
                {
                  var myResponse = responseGenerator.generateResponse(true,"some error occured"+err,500,null);
                  response.send(myResponse);
                }
                else if (result == null || result == undefined || result.userName == undefined) {
                  var myResponse = responseGenerator.generateResponse(true,"User Not Found. please try again later"+err,404,null);
                  response.send(myResponse);
                }
                else {
                  console.log(result);
                  request.session.user = result;
                  delete request.session.user.password;

                  /*var myResponse = responseGenerator.generateResponse(false,"logged in succesfully",200,result);
                  response.send(myResponse);*/
                  //console.log(request.session);

                       productModel.find({ 'userid' : request.session.user._id },function(error,result){
                           if(err)
                           {
                             var myResponse = responseGenerator.generateResponse(true,"some error occured",500,error);
                             response.send(myResponse);
                           }
                           else {
                             console.log(result);
                             //var myResponse = responseGenerator.generateResponse(false,"",200,result);
                             //response.send(myResponse);
                             response.render('product_view', { "product" : result, "user" : request.session.user });
                           }

                       });

                  /*if(!request.session.product)
                  {
                    request.session.product = "";
                  }*/


                  /*var myResponse = responseGenerator.generateResponse(false,"logged in succesfully",200,result);
                  response.send(myResponse);*/
                  //response.render('success_login', { user : result });

                }

             });

     });


     app.use('/users',UserRoute);



}
