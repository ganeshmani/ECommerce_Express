
var mongoose = require('mongoose');

var UserModel = mongoose.model('UserModel');

exports.loggedInUser = function(request,response,next)
{
  if(!request.session && !request.session.user){
   UserModel.findOne({'email' : request.session.user.email},function(err,result){
      if(result)
      {
        request.session.user = result;
        delete request.session.password;
        next();
      }
      else {

      }
   });
  }
}

exports.checkLogin = function(request,response,next)
{
  if(!request.session.user)
  {
    response.redirect('/users/login/show');
  }
  else {
    next();
  }
}
