var express = require('express');

var app = express();

var mongoose = require('mongoose');

var productRoute = express.Router();

var productModel = mongoose.model('productSchema');
var UserModel = mongoose.model('UserModel');
var responseGenerator = require('./../../libs/generateResponse.js');

var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;

module.exports.controller = function(app){

    productRoute.get('/product/create/show',function(request,response){
          response.render('createProduct');
    });


    //get all data of the product
    productRoute.get('/all',function(request,response){
         productModel.find({},function(err,res){
             if(err)
             {
               var myResponse = responseGenerator.generateResponse(true,"some error occured",500,err);
               response.send(myResponse);
             }
             else {
               var myResponse = responseGenerator.generateResponse(false,"",200,res);
               response.send(myResponse);
             }

         });
      });

      productRoute.get('/product/edit/show/:id',function(request,response){
        console.log(request.params.id);
        productModel.findOne( { '_id' : request.params.id },function(err,res){
             if(err){
               var myResponse = responseGenerator.generateResponse(true,"some error occured",500,err);
               response.send(myResponse);
             }
             else {
              console.log(res);
              response.render('editProduct',{ product : res });
            }
      });
      });

    productRoute.get('/productview',function(request,response){
           response.render('product_view');
    });

    productRoute.post('/product/create',function(request,response){
       var newProduct = new productModel({
            productName : request.body.productName,
            productType : request.body.productType,
            title : request.body.title,
            productDetails : request.body.productDetails,
            price : request.body.price

       });

       newProduct.save({},function(err){
          if(err)
          {
            var myResponse = responseGenerator.generateResponse(true,"some error occured",500,err);
            response.send(myResponse);
          }
          else {
            /*var myResponse = responseGenerator.generateResponse(false,"",200,newProduct);
            request.session.product = myResponse;
            response.send(myResponse);*/
            productModel.find({},function(error,result){
                if(err)
                {
                  var myResponse = responseGenerator.generateResponse(true,"some error occured",500,error);
                  response.send(myResponse);
                }
                else {
                  //var myResponse = responseGenerator.generateResponse(false,"",200,result);
                  //response.send(myResponse);
                  response.render('product_view', { "product" : result });
                }

            });
          }

        //  response.render('product_view',{ product : request.session.product });

       });

    });

        productRoute.put('/product/edit/:id',function(request,response){
            console.log(request.params.id);
            var update = request.body;
             productModel.findOneAndUpdate({ '_id' : request.params.id },update,function(err,res){

                  if(err){
                    var myResponse = responseGenerator.generateResponse(true,"some error occured",500,err);
                    response.send(myResponse);
                  }
                  else {
                    /*var myResponse = responseGenerator.generateResponse(false,"",200,res);
                    response.send(myResponse);*/
                    productModel.find({},function(error,result){
                        if(err)
                        {
                          var myResponse = responseGenerator.generateResponse(true,"some error occured",500,error);
                          response.send(myResponse);
                        }
                        else {
                          //var myResponse = responseGenerator.generateResponse(false,"",200,result);
                          //response.send(myResponse);
                          console.log(result);
                          response.render('product_view', { "product" : result });
                        }

                    });

                  }
                  //response.render('product_view',{ product : request.session.product });
             });
        });

    app.use('/products',productRoute);
}
