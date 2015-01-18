'use strict';

var fs = require("fs");
var path = require("path");

var basename  = path.basename(module.filename);

fs
  .readdirSync(__dirname)
  .filter(notDotFileNorIndex)
  .forEach(exportConfig);

function notDotFileNorIndex(file) {
  return (file.indexOf(".") !== 0) && (file !== basename);
}

function configName(file) {
  var name = file
    .substr(0, file.lastIndexOf('.'))
    .split('-')
    .map(function(val) {
      return val.charAt(0).toUpperCase() + val.slice(1);
    })
    .join('');
  return name.charAt(0).toLowerCase() + name.slice(1); 
}

function exportConfig(file) {
  exports[configName(file)] = require(path.join(__dirname, file));
}
