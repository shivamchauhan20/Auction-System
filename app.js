const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('./utils/cors'));
app.use(require('./controllers/user'));
// app.use(require('./controllers/product'));
app.use((req,res,next)=>{
    res.json({"msg":"Oops you typed something wrong"});
});
var arr = process.argv;
var config = require('./utils/config');
config.key = arr[2];
app.listen(process.env.PORT||2012,()=>{
    console.log('Congratulations Server Started');
});