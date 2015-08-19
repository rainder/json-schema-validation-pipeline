'use strict';

const _ = require('lodash');
const messages = require('./../../messages');
const objectPath = require('object-path');
const utils = require('./../utils');

module.exports = $schema;

const path$ = Symbol();

function $schema(objectToValidate, specs) {
  this[path$] = this[path$] || [];

  _.each(specs, function (validator, keyName) {
    this[path$].push(keyName);
    let fullKeyName = this[path$].join('.');
    let value = objectPath.get(objectToValidate, keyName);
    let validationResult = validator.call(this, value, keyName);
    this[path$].pop(keyName);

    if (validationResult.length === 0) {
      return;
    }

    let type = validator._constructor;

    for (let error of validationResult) {
      let message;
      if (messages.hasOwnProperty(type) && messages[type].hasOwnProperty(error.name)) {
        message = messages[type][error.name];
      } else {
        message = messages[error.name];
      }

      message = message
        .replace('%keyName', keyName)
        .replace('%keyPath', this[path$].concat(keyName).join('.'))
        .replace('%type', type)
        .replace('%actualType', utils.getType(error.actual))
        .replace('%expectedType', utils.getType(error.expected))
        .replace('%actualLength', (error.actual || '').length)
        .replace('%actual', error.actual)
        .replace('%expected', error.expected);

      this.errors[fullKeyName] = message;
    }
  }, this);

  return this;
}