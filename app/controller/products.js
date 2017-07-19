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
               var myResponse = responseGenerator.generateResponse(true,"some error occured"+err,500,null);
               response.send(myResponse);
             }
             else {
               var myResponse = responseGenerator.generateResponse(false,"",200,res);
               response.send(myResponse);
             }

         });
      });

      //edit templating engine render
      productRoute.get('/product/edit/show/:id',function(request,response){
        console.log(request.params.id);
        productModel.findOne( { '_id' : request.params.id },function(err,res){
             if(err){
               var myResponse = responseGenerator.generateResponse(true,"some error occured"+err,500,null);
               response.send(myResponse);
             }
             else {
              console.log(res);
              response.render('editProduct',{ product : res });
            }
      });
      });

    //product view templating engine
    productRoute.get('/productview',function(request,response){
       productModel.find({ 'userid' : request.session.user._id },function(err,res){
          if(err){
            var myResponse = responseGenerator.generateResponse(true,"some error occured"+err,500,null);
            response.send(myResponse);
          }
          else {
            response.render('product_view',{ "product" : res, "user" : request.session.user });
          }
       });

    });

    //create a product
    productRoute.post('/product/create',function(request,response){
       var newProduct = new productModel({
            productName : request.body.productName,
            productType : request.body.productType,
            title : request.body.title,
            productDetails : request.body.productDetails,
            price : request.body.price,
            userid : request.session.user._id

       });

       newProduct.save({},function(err){
          if(err)
          {
            var myResponse = responseGenerator.generateResponse(true,"some error occured"+err,500,null);
            response.send(myResponse);
          }
          else {
            /*var myResponse = responseGenerator.generateResponse(false,"",200,newProduct);
            request.session.product = myResponse;
            response.send(myResponse);*/
            productModel.find({ 'userid' : request.session.user._id },function(error,result){
                if(err)
                {
                  var myResponse = responseGenerator.generateResponse(true,"some error occured"+error,500,null);
                  response.send(myResponse);
                }
                else {
                  //var myResponse = responseGenerator.generateResponse(false,"",200,result);
                  //response.send(myResponse);
                  response.render('product_view', { "product" : result,"user" : request.session.user });
                }

            });
          }

        //  response.render('product_view',{ product : request.session.product });

       });

    });

       //delete a product
       productRoute.post('/product/delete/:id',function(request,response){
           productModel.remove({ '_id' : request.params.id } ,function(err,res){
              if(err){
                var myResponse = responseGenerator.generateResponse(true,"some error occured"+err,500,null);
                response.send(myResponse);
              }
              else{
                productModel.find({ 'userid' : request.session.user._id },function(error,result){
                    if(err)
                    {
                      var myResponse = responseGenerator.generateResponse(true,"some error occured"+error,500,null);
                      response.send(myResponse);
                    }
                    else {
                      //var myResponse = responseGenerator.generateResponse(false,"",200,result);
                      //response.send(myResponse);
                      console.log(result);
                      response.render('product_view', { "product" : result,"user" : request.session.user });
                    }

                });
              }
           });

       });

        //edit a product
        productRoute.post('/product/edit/:id',function(request,response){

            var update = request.body;
             productModel.findOneAndUpdate({ '_id' : request.params.id },update,function(err,res){

                  if(err){
                    var myResponse = responseGenerator.generateResponse(true,"some error occured"+err,500,null);
                    response.send(myResponse);
                  }
                  else {
                    /*var myResponse = responseGenerator.generateResponse(false,"",200,res);
                    response.send(myResponse);*/
                    productModel.find({ 'userid' : request.session.user._id },function(error,result){
                        if(err)
                        {
                          var myResponse = responseGenerator.generateResponse(true,"some error occured"+error,500,null);
                          response.send(myResponse);
                        }
                        else {
                          //var myResponse = responseGenerator.generateResponse(false,"",200,result);
                          //response.send(myResponse);
                          console.log(result);
                          response.render('product_view', { "product" : result,"user" : request.session.user });
                        }

                    });

                  }
                  //response.render('product_view',{ product : request.session.product });
             });
        });

        //rendering cart template
        productRoute.get('/product/cart',function(request,response){
            cartModel.find({'userid' : request.session.user._id},function(err,res){
              if(err){
                var myResponse = responseGenerator.generateResponse(true,"some error occured"+err,500,null);
                response.send(myResponse);
              }
              else{
                    response.render('cart_view',{ "cart" : res});
              }
            });


        });


        //adding product to cart
        productRoute.post('/product/addcart/:id',function(request,response){
            productModel.findOne({ '_id': request.params.id },function(err,result){
              if(err){
                var myResponse = responseGenerator.generateResponse(true,"some error occured"+err,500,null);
                response.send(myResponse);
              }
              else {
                  var newcart = new cartModel({
                        productName : result.productName,
                        productType : result.productType,
                        title       : result.title,
                        productDetails : result.productDetails,
                        price       : result.price,
                        quantity    : 1,
                        userid      : request.session.user._id

                  });

                  newcart.save({},function(error,res){
                    if(error){
                      var myResponse = responseGenerator.generateResponse(true,"some error occured"+error,500,null);
                      response.send(myResponse);
                    }
                    else {
                      cartModel.find({ 'userid' : request.session.user._id },function(errvalue,resultvalue){
                          if(errvalue)
                          {
                            var myResponse = responseGenerator.generateResponse(true,"some error occured"+errvalue,500,null);
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


        //deleting a product from cart
        productRoute.post('/product/deleteCart/:id',function(request,response){
            cartModel.remove({ '_id' : request.params.id },function(err,res){
                  if(err){
                    var myResponse = responseGenerator.generateResponse(true,"some error occured"+error,500,null);
                    response.send(myResponse);
                  }
                  else {
                    cartModel.find({ 'userid' : request.session.user._id },function(errvalue,resultvalue){
                        if(errvalue)
                        {
                          var myResponse = responseGenerator.generateResponse(true,"some error occured"+errvalue,500,null);
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

            });

        });

         //API to view product
         productRoute.get('/product/view/:id',function(request,response){
           productModel.findOne({ '_id' : request.params.id },function(err,res){
              if(err){
                var myResponse = responseGenerator.generateResponse(true,"some error occured"+err,500,null);
                response.send(myResponse);
              }
              else {
                  response.render('viewProduct', { "product" : res });
               }

           })

        });

    app.use('/products',productRoute);
}
