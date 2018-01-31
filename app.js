/* load packages */
const express    = require("express");
const app        = express();
const bodyparser = require("body-parser");
const session    = require('express-session');
const mongoose   = require('mongoose');
const schema     = mongoose.Schema;

/* set session */
app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}));

/* set view engine - ejs */
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({ extended : true }));
app.use(bodyparser.json());
app.use(express.static(__dirname + '/public'));

/* models */
var Book    = require('./models/book');
var User    = require('./models/user');
var buyLog  = require('./models/buyLog');
var Product = require('./models/product');
var models = {
    Book : Book,
    User : User,
    buyLog  : buyLog,
    Product : Product
}

/* router */
var router = require('./routes/router.js')(app, models);

/* connect MongoDB */
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log("Connected to mongod server");
});
mongoose.connect('mongodb://127.0.0.1:27017/shopping');

/* listen server */
var port = process.env.PORT || 3000;
var server = app.listen(port,function(){
    console.log("express server is running in port : " + port);
});