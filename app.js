

var express = require('express');

var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require('morgan');
var fs = require('fs');

var path = require('path');


app.use(bodyParser.json({ limit: '10mb',extended : true }));
app.use(bodyParser.urlencoded({ limit : '10mb',extendede : true }));
app.use(logger('dev'));
app.set('view engine','jade');
app.set('views',path.join(__dirname + '/app/views'));

var dbPath = "mongodb://localhost/mvcdb";



db = mongoose.connect(dbPath);

mongoose.connection.once('open',function()
{
   console.log("database is connected successfully");
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

app.listen(3000,function(){
  console.log("app is listening to port 3000");
});
