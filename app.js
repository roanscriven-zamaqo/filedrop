const fileUpload = require('express-fileupload');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport'); 
var LocalStrategy = require('passport-local').Strategy;
var session = require("express-session");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(fileUpload());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret : "zamaqo@test123"})); 
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', function(req, res){
    return res.render('login')
}); 
app.post('/login',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

app.use(isAuthenticated);   
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    if (username === process.env.USERNAME && password === process.env.PASSWORD){
      return done(null, {username: process.env.USERNAME}); 
    }
    else {
      return done(null, false, {message: "Incorrect username or password"}); 
    }
  })
);

passport.serializeUser(function(user, done) {
  process.nextTick(function(){
    done(null, user);
  }); 
});

passport.deserializeUser(function(user, done) { 
  process.nextTick(function(){
    done(null, user);
  }); 
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  else 
    return res.redirect('/login');
}

module.exports = app;
