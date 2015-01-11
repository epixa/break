'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', { title: 'Break' });
});

router.route('/signup')
  .get(function(req, res) {
    res.render('signup', { title: 'Signup' });
  })
  .post(function(req, res) {
    res.json(req.body);
  });

router.route('/login')
  .get(function(req, res) {
    res.render('login', { title: 'Login' });
  })
  .post(function(req, res) {
    res.json(req.body);
  });

module.exports = router;
