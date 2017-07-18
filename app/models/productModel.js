
var express = require('express');

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var productSchema = new Schema({
    productName : {type : String , default : null,required : true},
    productType : {type : String , default : null },
    title       : { type : String , default : null },
    productDetails : { type : String , default : null },
    price       : { type : Number , default : null }
});

mongoose.model('productSchema',productSchema);
