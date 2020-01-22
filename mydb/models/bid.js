const mongoose = require('../connection');
var Schema = mongoose.Schema;
var BidSchema = new Schema({
    'author':{type:mongoose.Schema.Types.ObjectId,ref:'UserCollection'},
    'pid':{type:mongoose.Schema.Types.ObjectId,ref:'ProductCollection'},
    'bidamount':{type:Number,required:true}
});
var BidCollection = mongoose.model('bids',BidSchema);
module.exports = BidCollection;