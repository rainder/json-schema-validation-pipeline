'use strict';

const _ = require('lodash');
const messages = require('./../../messages');
const objectPath = require('object-path');

module.exports = $schema;

const path$ = Symbol();

function $schema(objectToValidate, specs) {
  this[path$] = this[path$] || [];

  _.each(specs, function (validator, keyName) {
    if (!validator.hasOwnProperty('type')) {
      validator = validator.type();
    }

    this[path$].push(keyName);
    let value = objectPath.get(objectToValidate, keyName);
    let validationResult = validator.call(this, value, keyName);
    this[path$].pop(keyName);

    if (validationResult.success === true) {
      return;
    }
    
    let type = validator
      .__constructor
      .toString()
      .match(/function ([^\(]+)/)[1];

    for (let error of validationResult.failed) {
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
        .replace('%actual', error.actual)
        .replace('%expected', error.expected);

      this.errors.push(message);
    }
  }, this);

  this.success = this.errors.length === 0;
  return this;
}