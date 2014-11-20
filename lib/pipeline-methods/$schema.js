/**
 * Created by Andrius Skerla on 19/11/14.
 * mailto: andrius@skerla.com
 */
var _ = require('lodash');

module.exports = $schema;
var object = require('./../object');

function $schema(objectToValidate, specs) {
  _.each(specs, function (validator, keyName) {
    var keyPath = Array.prototype.concat([], this.path, keyName).join('.');
    var value = object.get(objectToValidate, keyPath);
    var error = validator(value);

    if (error) {
      this.errors.push(error);
    }
  }, this);

  return this;
}