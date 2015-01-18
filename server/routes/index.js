'use strict';

var express = require('express');
var users = require('../lib/users');
var InvalidArg = require('../lib/errors').InvalidArg;
var AuthError = require('../lib/errors').AuthError;
var NotFound = require('../lib/errors').NotFound;

module.exports = exports = express.Router();

exports.get('/', function(req, res) {
  res.render('index', { title: 'Break' });
});

exports.route('/signup')
  .get(function(req, res) {
    res.render('signup', { title: 'Signup' });
  })
  .post(function(req, res, next) {
    if (!req.body.email) throw new InvalidArg('Email is required');
    if (!req.body.password) throw new InvalidArg('Password is required');
    users.create(req.body).then(function(user) {
      res.status(201).json(user);
    }).catch(next);
  });

exports.route('/login')
  .get(function(req, res) {
    res.render('login', { title: 'Login' });
  })
  .post(function(req, res, next) {
    if (!req.body.email) throw new InvalidArg('Email is required');
    if (!req.body.password) throw new InvalidArg('Password is required');
    req.promise = users.authenticate(req.body.email, req.body.password)
      .then(function(user) {
        res.status(200).json(user);
      })
      .catch(AuthError, function(err) {
        next(new NotFound('No user found with those credentials'));
      });
  });
