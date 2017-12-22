var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    userid : String,
    userpw : String,
    usernm : String,
    userad : String,
    userph : String
});

module.exports = mongoose.model('user', userSchema);