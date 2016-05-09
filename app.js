var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Passport authentication
var passport = require('passport'); 
var Strategy = require('passport-local').Strategy;
var db_test = require('./db_test'); 

passport.use(new Strategy(function(username, password, cb) {
    db_test.users.findByUsername(username, function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        if (user.password != password) { return cb(null, false); }
        return cb(null, user);
    });
}));

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    db_test.users.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

// MondoDB interfacing code
var mongo = require('mongodb');
var monk = require('monk');

var MNGU = process.env.FIRST_EXPRESS_APP_UNAME;
var MNGP = process.env.FIRST_EXPRESS_APP_PASSW;
var db = monk(MNGU+':'+MNGP+'@localhost:27017/first_express_app');

var app = express();
app.set('trust proxy', 'loopback'); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Passport authentication setup
var ESSECRET = process.env.FIRST_EXPRESS_APP_EXPRESS_SESSION_SECRET;
app.use(require('express-session')({secret: ESSECRET, resave: false, saveUninitialized: false})); 
app.use(passport.initialize()); 
app.use(passport.session()); 

// Make the DB accessible to the router
app.use( function (req, res, next) {
    req.db = db; 
    req.db_test = db_test; 
    next(); 
}); 

var routes = require('./routes/index');
var users = require('./routes/users');

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
