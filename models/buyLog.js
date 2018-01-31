var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
    pid     : String, //product id
    bid     : String, //buyer id
    quntity : String, //product quntity
    price   : Number, //total price
    status  : String, //buy || cart
    date    : { type : Date, default : Date.now } //buy day
});

module.exports = mongoose.model('buyLog', bookSchema);