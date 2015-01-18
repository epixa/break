'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nconf = require('nconf');
var Promise = require('bluebird');
var _ = require('lodash');
var NotFound = require('./lib/errors').NotFound;

var app = express();

nconf
  .env()
  .argv()
  .defaults(require('../config'));

if (app.get('env') === 'development') {
  Promise.longStackTraces();
  var db = require('./models');
  db.Sequelize.Promise.longStackTraces();
}

var routes = require('./routes/index');
var users = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

//app.use(favicon(path.join(__dirname, '..', 'client', 'favicon.ico')));
app.use(express.static(path.join(__dirname, '..', 'client')));
if (app.get('env') === 'development') {
  app.use('/bundle.js', function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'build', 'break.js'));
  });
}
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routes);
app.use('/users', users);

// catch requests that have no handler and make sure we 404
app.use(function(req, res, next) {
  next(new NotFound());
});

// start compiling error data on response
app.use(function(err, req, res, next) {
  res.data = _.pick(err, ['status', 'name', 'message']);
  next(err);
});

// attach stack trace to response data in development
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    if (err.stack) {
      res.data = _.assign(res.data || {}, {
        stack: err.stack,
        stackArray: err.stack.split("\n")
      });
    }
    next(err);
  });
}

// main http error handler
app.use(function(err, req, res, next) {
  res.status(res.data.status || err.status || 500);
  res.format({
    json: function() { return res.json(res.data || {}); },
    html: function() { return res.render('error', res.data || {}); }
  });
});


module.exports = app;
