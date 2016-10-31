var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require ('express-session');//1
var expressValidator = require('express-validator');13
var passport = require ('passport');//2
var LocalStrategy = require ('passport-local').Strategy;//3
var bodyParser = require('body-parser');
var multer = require('multer');//4
//handle file uploads
//var upload = multer({dest:'./uploads'});//9
var flash = require('connect-flash');//5
var mongo = require('mongodb');//6
var mongoose = require ('mongoose');//7
var db = mongoose.connection;//8

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');




// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//Handle the Validator
// In this example, the formParam value is going to get morphed into form body format useful for printing.
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));//12

//handle Express Sessions
app.use(session({
  secret:'secret',
  saveUninitialized: 'true',
  resave: 'true'
}));//10

//Handle passport be sure that passport is always after the Express Session middleware
app.use(passport.initialize());
app.use(passport.session());//11



app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Handle connect-flash and add to middleware
app.use(flash());//13
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});//14


app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
