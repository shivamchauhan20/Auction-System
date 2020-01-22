const mongoose = require('../connection');
var Schema = mongoose.Schema;
var ProductSchema = new Schema({
    'author':{type:mongoose.Schema.Types.ObjectId,ref:'UserCollection'},
    'pname':{type:String, required:true},
    'pdesc':{type:String,required:true},
    'amount':{type:Number,required:true},
    'time':{type:String,required:true},
    'category':{type:String,required:true},
    'image':{type:String,required:true}
});
var ProductCollection = mongoose.model('products',ProductSchema);
module.exports = ProductCollection;