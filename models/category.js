var mongoose = require("mongoose");

var categorySchema = new mongoose.Schema({
    category : String
});

module.exports = mongoose.model('category', categorySchema);