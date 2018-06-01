/* load packages */
const express    = require("express");
const app        = express();
const bodyparser = require("body-parser");
const session    = require('express-session');
const mongoose   = require('mongoose');
const schema     = mongoose.Schema;

/* set session */
app.use(session({
    secret: '#416#a#518^@#',
    resave: false,
    saveUninitialized: true
}));

/* set view engine - ejs */
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({ extended : true }));
app.use(bodyparser.json());
app.use(express.static(__dirname + '/public'));

/* set helemt for x-powered-body */
var helmet = require('helmet');
app.use(helmet());
app.disable('x-powered-by');

/* models */ 
var Book     = require('./models/book');
var User     = require('./models/user');
var buyLog   = require('./models/buyLog');
var Product  = require('./models/product');
var Category = require('./models/category');
var models = {
    Book     : Book,
    User     : User,
    buyLog   : buyLog,
    Product  : Product,
    Category : Category
}

/* model router */
var router = require('./routes/router.js')(app, models);

/* connect MongoDB */
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log("Connected to mongod server");
});
mongoose.connect('mongodb://localhost/shopping');

/* listen server */
var port = process.env.PORT || 3000;
var server = app.listen("3000",function(){
    console.log("express server is running in port : " + port);
});