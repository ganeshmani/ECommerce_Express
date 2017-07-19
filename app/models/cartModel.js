var express = require('express');

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var cartSchema = new Schema({
    productName : {type : String , default : null,required : true},
    productType : {type : String , default : null },
    title       : { type : String , default : null },
    productDetails : { type : String , default : null },
    price       : { type : Number , default : null },
    quantity   : { type : Number,default : null },
    userid : { type : String,default : null }
});

mongoose.model('cartSchema',cartSchema);
