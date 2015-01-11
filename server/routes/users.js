'use strict';

var express = require('express');
module.exports = exports = express.Router();

/* GET users listing. */
exports.get('/', function(req, res) {
  res.send('respond with a resource');
});
