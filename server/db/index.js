'use strict';

var mongodb = require('mongodb');
var Promise = require('bluebird');
var _ = require('lodash');
var nconf = require('nconf');

Promise.promisifyAll(mongodb.MongoClient);
Promise.promisifyAll(mongodb.Collection.prototype);

var url = nconf.get('mongo:url');

module.exports = mongodb.MongoClient.connectAsync(url);
