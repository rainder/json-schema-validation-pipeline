'use strict';

const _ = require('lodash');
const messages = require('./../../messages');
const objectDeep = require('object-deep');
const utils = require('./../utils');

module.exports = $cast;

/**
 *
 * @param objectToValidate
 * @param specs
 * @returns {$cast}
 */
function $cast(objectToValidate, specs) {
  for (let key of Object.keys(specs)) {
    let toType = specs[key];
    let value = objectDeep.get(objectToValidate, key);

    try {
      switch (toType) {
        case String:
          value = toString(value);
          break;
        case Number:
          value = toNumber(value);
          break;
        default:
          throw new Error();
      }

      objectDeep.set(objectToValidate, key, value);
    } catch (e) {
      let message = messages['$cast']
        .replace('%keyPath', key)
        .replace('%type', utils.getType(toType));

      this.errors['$cast'] = message;
    }
  }

  return this;
}

/**
 *
 * @param value
 * @returns {*}
 */
function toString(value) {
  switch (true) {
    case _.isString(value):
      return value;
    case _.isNumber(value):
      return value.toString();
    default:
      throw new Error();
  }
}

/**
 *
 * @param value
 * @returns {*}
 */
function toNumber(value) {
  switch (true) {
    case _.isNumber(value):
      return value;
    case _.isString(value):
      return +value;
    default:
      throw new Error();
  }
}