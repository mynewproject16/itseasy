var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var http = require('http');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var methodOverride = require('method-override');
var session = require('express-session');

var app = express();
var mongoDBUrl = "mongodb://localhost:27017/itseasy";

app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: '-itseasy-secret'
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/pdfs/', express.static(path.join(__dirname, 'pdfs')));

mongoose.Promise = require('bluebird');

mongoose.connect(mongoDBUrl, function(err) {
  if (err) {
    console.log(err);
    process.exit(0);
  } else {
    console.log('Mongodb connected');
  }
});

require("./routes.js")(app);

module.exports = app;
