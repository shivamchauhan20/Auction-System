const express = require('express');
// const passport = require('passport');
// const FacebookStrategy = require('passport-facebook');
// const configAuth = require('../utils/auth');
const route = express.Router();
route.post('/login',(req,res)=>{
    var userObject = req.body;
    var userOperations = require('../mydb/helpers/useroperation');
    userOperations.searchUser(userObject,res);
});
route.post('/register',(req,res)=>{
    var userObject = req.body;
    var userOperations = require('../mydb/helpers/useroperation');
    userOperations.addUser(userObject,res);
});
route.post('/sendfeedback',(req,res)=>{
    var feedObject = req.body;
    var feedbackOperations = require('../mydb/helpers/feedbackoperation');
    feedbackOperations.addFeedback(feedObject,res);
});
route.post('/deletefeedback',(req,res)=>{
    var fid = req.body.fid;
    var feedbackOperations = require('../mydb/helpers/feedbackoperation');
    feedbackOperations.deleteFeedback(fid,res);
});
route.post('/fetchfeedbacks',(req,res)=>{
    var feedbackOperations = require('../mydb/helpers/feedbackoperation');
    feedbackOperations.getFeedbacks(res);
});
route.post('/addproduct',(req,res)=>{
    var reqObject = req.body;
    var userOperations = require('../mydb/helpers/useroperation');
    userOperations.addProduct(reqObject,res);
});
route.post('/fetchproducts',(req,res)=>{
    var userOperations = require('../mydb/helpers/useroperation');
    userOperations.productList(res);
});
route.post('/deleteproduct',(req,res)=>{
    var reqObject = req.body;
    var userOperations = require('../mydb/helpers/useroperation');
    userOperations.deleteProduct(reqObject,res);
});
route.post('/addbid',(req,res)=>{
    var reqObject = req.body;
    var userOperations = require('../mydb/helpers/useroperation');
    userOperations.addBid(reqObject,res);
});
route.post('/getbids',(req,res)=>{
    var pid = req.body.pid;
    var userOperations = require('../mydb/helpers/useroperation');
    userOperations.getBids(pid,res);
});
route.post('/endauction',(req,res)=>{
    var pid = req.body.pid;
    var userOperations = require('../mydb/helpers/useroperation');
    userOperations.endAuction(pid,res);
});
route.post('/addfeedback',(req,res)=>{
    var feedObject = req.body;
    var userOperations = require('../mydb/helpers/useroperation');
    userOperations.addFeedback(feedObject,res);
});
route.post('/fetchfeedbacks',(req,res)=>{
    var userOperations = require('../mydb/helpers/useroperation');
    userOperations.feedbackList(res);
});
route.post('/changepassword',(req,res)=>{
    var userObject = req.body;
    var userOperations = require('../mydb/helpers/useroperation');
    userOperations.changePassword(userObject,res);
});
// var fbOpts = {
//     clientID: configAuth.clientID,
//     clientSecret: configAuth.clientSecret,
//     callbackURL: "http://localhost:2012/auth/facebook/callback"
// }
// var fbCallback = function(accessToken, refreshToken, profile, cb) {
//     console.log('Access token is '+accessToken+'Refresh token is '+refreshToken+'Profile is '+profile);
// }
// route.get('/auth/facebook',
//   passport.authenticate('facebook'));

// route.get('/auth/facebook/callback',
//   passport.authenticate('facebook', {
//     failureRedirect: '/' }),
//   function(err,user,info) {
//     // Successful authentication, redirect home.
//     // res.redirect('/login');
//     console.log('Error is '+err+'User is '+user+'Info is '+info);
//   });
// passport.use(new FacebookStrategy(fbOpts,fbCallback)
//     // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
//     //   return cb(err, user);
//     // });
// );  
module.exports = route;