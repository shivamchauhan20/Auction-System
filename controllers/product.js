const express = require('express');
const route = express.Router();
route.post('/addproduct',(req,res)=>{
    var productObject = req.body;
    var productOperations = require('../mydb/helpers/productoperation');
    productOperations.addProduct(productObject,res);
});
route.post('/deleteproduct',(req,res)=>{
    var pid = req.body.pid;
    var productOperations = require('../mydb/helpers/productoperation');
    productOperations.deleteProduct(pid,res);
});
module.exports = route;