var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
    name      : String,
    price     : Number,
    category  : String,
    image_url : String
});

module.exports = mongoose.model('product', productSchema);