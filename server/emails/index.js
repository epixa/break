"use strict";

var emails     = require('email-templates');
var nconf      = require('nconf');
var nodemailer = require('nodemailer');
var Promise    = require('bluebird');
var _          = require('lodash');

var config = nconf.get('email');
var loadTemplates = Promise.promisify(emails)(__dirname).then(Promise.promisify);

var transportModules = {
  ses: 'nodemailer-ses-transport',
  smtp: 'nodemailer-smtp-transport'
}

if (!transportModules[config.transport.name]) {
  throw new Error('Unknown email transport: ' + config.transport.name);
}
var adapter = require(transportModules[config.transport.name]);
var initTransport = adapter(_.omit(config.transport, 'name'));
var transport = nodemailer.createTransport(initTransport);
Promise.promisifyAll(transport);

module.exports = function(template, email, subject, data) {
  return loadTemplates
    .then(function(templateParser) {
      return templateParser(template, data);
    })
    .then(_.partial(toEmailMetaData, email, subject))
    .then(transport.sendMailAsync);
};

function toEmailMetaData(email, subject, html, text) {
  return _.assign(
    _.cloneDeep(config.meta), // don't want to modify config.meta directly
    {
      html: html,
      text: text,
      to: email,
      subject: subject
    }
  );
}
