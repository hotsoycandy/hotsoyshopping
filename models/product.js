var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
    name      : String,
    price     : Number,
    category  : [String],
    seller_id : String,
    image_url : String,
    reg_date  : { type : Date, default : Date.now }
});

module.exports = mongoose.model('product', productSchema);