var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    nombre:String,
    edad:Number,
    account_Id: String
});

module.exports = mongoose.model('User',User,'User');