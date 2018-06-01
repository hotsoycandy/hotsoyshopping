var mongoose = require("mongoose");

var buyLogSchema = new mongoose.Schema({
    pid     : String, //product id
    bid     : String, //buyer id
    name    : String, //product name
    quntity : Number, //product quntity
    price   : Number, //total price
    status  : String, //buy || cart
    date    : { type : Date, default : Date.now } //buy day
});

module.exports = mongoose.model('buyLog', buyLogSchema);