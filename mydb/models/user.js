const mongoose = require('../connection');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    'userid':{type:String, required:true, unique:true},
    'name':{type:String,required:true},
    'password':{type:String, required:true},
    'email':{type:String,required:true},
    'products':[{type:mongoose.Schema.Types.ObjectId,ref:'ProductCollection'}],
    'feedbacks':[{type:mongoose.Schema.Types.ObjectId,ref:'FeedbackCollection'}]
});
var UserCollection = mongoose.model('users',UserSchema);
module.exports = UserCollection;