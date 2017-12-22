/* load packages */
var express     = require("express");
var app         = express();
var bodyparser  = require("body-parser");
var session     = require('express-session');
var mongoose    = require('mongoose');
var schema      = mongoose.Schema;


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

var port = process.env.PORT || 3000;

/* models */
var Book = require('./models/book');
var User = require('./models/user');
var models = {
    Book : Book,
    User : User
}

/* router */
var router = require('./routes/router.js')(app, models);

/* connect MongoDB */
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log("Connected to mongod server");
});
mongoose.connect('mongodb://localhost/shopping');

/* listen server */
var server = app.listen(port,function(){
    console.log("express server is running in port : " + port);
});