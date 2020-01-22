const mongoose = require('../connection');
var Schema = mongoose.Schema;
var FeedbackSchema = new Schema({
    'name':{type:String,required:true},
    'subject':{type:String,required:true},
    'desc':{type:String,required:true},
    'date':{type:String,required:true}
});
var FeedbackCollection = mongoose.model('feedbacks',FeedbackSchema);
module.exports = FeedbackCollection;