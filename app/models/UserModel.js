var mongoose = require('mongoose');
var UserSchema = mongoose.Schema;

var UserModel = new UserSchema({
  userName : { type : String,default : null,required : true },
  email : { type : String,default : null },
  password : { type : String , default : null },
  Address : { type : String,default : null }
  });

mongoose.model('UserModel',UserModel);
