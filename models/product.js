var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
    name      : String,
    price     : Number,
    price     : Number,
    category  : [String],
    seller_id : String,
    image_url : String
});

module.exports = mongoose.model('product', productSchema);