var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
    title : String,
    author : String,
    published_date : { type : Date, default : Date.now }
});

module.exports = mongoose.model('book', bookSchema);