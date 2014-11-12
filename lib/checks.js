/**
 * Created by Andrius Skerla on 12/11/14.
 * mailto: andrius@skerla.com
 */

var _ = require('lodash');

module.exports = exports = {};

exports.checkNumber = checkNumber;
exports.checkString = checkString;
exports.checkObject = checkObject;
exports.checkFunction = checkFunction;
exports.checkBoolean = checkBoolean;

/**
 *
 * @param key
 * @param value
 * @param spec
 * @returns {*}
 */
function checkNumber(key, value, spec) {
  if (!_.isNumber(value)) {
    return '`' + key + '` must be a number';
  }

  if (spec.hasOwnProperty('min')) {
    if (value < spec.min) {
      return '`' + key + '` should be greater or equal to ' + spec.min;
    }
  }

  if (spec.hasOwnProperty('max')) {
    if (value > spec.max) {
      return '`' + key + '` should be less or equal to ' + spec.min;
    }
  }

  if (spec.hasOwnProperty('oneOf')) {
    if (!~spec.oneOf.indexOf(value)) {
      return '`' + key + '` should be one of ' + spec.oneOf.join(', ');
    }
  }

  if (spec.hasOwnProperty('fn')) {
    return spec.fn(value);
  }

  return true;
}

/**
 *
 * @param key
 * @param value
 * @param spec
 * @returns {*}
 */
function checkString(key, value, spec) {
  if (!_.isString(value)) {
    return '`' + key + '` must be a string';
  }

  if (spec.hasOwnProperty('min')) {
    if (value.length < spec.min) {
      return 'The length of `' + key + '` should be greater or equal to ' + spec.min;
    }
  }

  if (spec.hasOwnProperty('max')) {
    if (value.length > spec.max) {
      return 'The length of `' + key + '` should be less or equal to ' + spec.min;
    }
  }

  if (spec.hasOwnProperty('regexp')) {
    if (!value.match(spec.regexp)) {
      return '`' + key + '` does not match regexp ' + spec.regexp;
    }
  }

  if (spec.hasOwnProperty('oneOf')) {
    if (!~spec.oneOf.indexOf(value)) {
      return '`' + key + '` should be one of ' + spec.oneOf.join(', ');
    }
  }

  if (spec.hasOwnProperty('fn')) {
    return spec.fn(value);
  }

  return true;
}

/**
 *
 * @param key
 * @param value
 * @param spec
 * @returns {*}
 */
function checkObject(key, value, spec) {
  if (!_.isObject(value)) {
    return '`' + key + '` must be an object';
  }

  if (spec.hasOwnProperty('fn')) {
    return spec.fn(value);
  }

  return true;
}

/**
 *
 * @param key
 * @param value
 * @param spec
 * @returns {boolean}
 */
function checkFunction(key, value, spec) {
  if (spec.hasOwnProperty('fn')) {
    return spec.fn(value, key);
  }

  return true;
}

/**
 *
 * @param key
 * @param value
 * @param spec
 */
function checkBoolean(key, value, spec) {
  return _.isBoolean(value) ? true : '`' + key + '` must be boolean.';
}