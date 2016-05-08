var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Admin = new Schema({
    username: String,
    password: String,
    fechaAlta: { type: Date, default: Date.now }, //de esta manera se pone el Timestamp
    fechaBaja: {type:Date, default : ""}
});

Admin.plugin(passportLocalMongoose);

module.exports = mongoose.model('Admin', Admin,'Admin');