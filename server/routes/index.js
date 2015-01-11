'use strict';

var express = require('express');
module.exports = exports = express.Router();

exports.get('/', function(req, res) {
  res.render('index', { title: 'Break' });
});

exports.route('/signup')
  .get(function(req, res) {
    res.render('signup', { title: 'Signup' });
  })
  .post(function(req, res) {
    res.json(req.body);
  });

exports.route('/login')
  .get(function(req, res) {
    res.render('login', { title: 'Login' });
  })
  .post(function(req, res) {
    res.json(req.body);
  });
