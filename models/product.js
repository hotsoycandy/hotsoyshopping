var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
    name : String,
    price : Number,
    image_url : String,
    category : [String]
});

module.exports = mongoose.model('product', productSchema);