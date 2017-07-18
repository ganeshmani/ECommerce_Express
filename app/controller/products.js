var express = require('express');

var app = express();

var mongoose = require('mongoose');

var productRoute = express.Router();

var productModel = mongoose.model('productSchema');
var UserModel = mongoose.model('UserModel');
var cartModel = mongoose.model('cartSchema');
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
       productModel.find({},function(err,res){
          if(err){
            var myResponse = responseGenerator.generateResponse(true,"some error occured",500,err);
            response.send(myResponse);
          }
          else {
            response.render('product_view',{ "product" : res });
          }
       });

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

       productRoute.post('/product/delete/:id',function(request,response){
           productModel.remove({ '_id' : request.params.id } ,function(err,res){
              if(err){
                var myResponse = responseGenerator.generateResponse(true,"some error occured",500,err);
                response.send(myResponse);
              }
              else{
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
           });

       });

        productRoute.post('/product/edit/:id',function(request,response){

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

        productRoute.get('/product/cart',function(request,response){
            cartModel.find({},function(err,res){
              if(err){
                var myResponse = responseGenerator.generateResponse(true,"some error occured",500,err);
                response.send(myResponse);
              }
              else{
                    response.render('cart_view',{ "cart" : res});
              }
            });


        });


        productRoute.post('/product/addcart/:id',function(request,response){
            productModel.findOne({ '_id': request.params.id },function(err,result){
              if(err){
                var myResponse = responseGenerator.generateResponse(true,"some error occured",500,err);
                response.send(myResponse);
              }
              else {
                  var newcart = new cartModel({
                        productName : result.productName,
                        productType : result.productType,
                        title       : result.title,
                        productDetails : result.productDetails,
                        price       : result.price,
                        quantity    : 1

                  });

                  newcart.save({},function(error,res){
                    if(error){
                      var myResponse = responseGenerator.generateResponse(true,"some error occured",500,error);
                      response.send(myResponse);
                    }
                    else {
                      cartModel.find({},function(errvalue,resultvalue){
                          if(errvalue)
                          {
                            var myResponse = responseGenerator.generateResponse(true,"some error occured",500,errvalue);
                            response.send(myResponse);
                          }
                          else {
                            //var myResponse = responseGenerator.generateResponse(false,"",200,result);
                            //response.send(myResponse);
                            console.log(resultvalue);
                            response.render('cart_view', { "cart" : resultvalue });
                          }

                      });

                    }
                  })
              }
            });

        });

    app.use('/products',productRoute);
}
