'use strict';

var _ = require('lodash');

module.exports = exports = {};

/**
 *
 * @param actual
 * @returns {*}
 */
exports.type = function (actual) {
  return _.isUndefined(actual) || _.isArray(actual);
};

/**
 *
 * @param actual
 * @returns {boolean}
 */
exports.required = function (actual) {
  return !_.isUndefined(actual);
};

/**
 *
 * @param expected
 * @param actual
 * @returns {boolean}
 */
exports.min = function (actual, expected) {
  return _.isUndefined(actual) || actual.length >= expected;
};

/**
 *
 * @param expected
 * @param actual
 * @returns {boolean}
 */
exports.max = function (actual, expected) {
  return _.isUndefined(actual) || actual.length <= expected;
};

/**
 *
 * @param expected
 * @param actual
 * @returns {boolean}
 */
exports.len = function (actual, expected) {
  return _.isUndefined(actual) || actual.length === expected;
};

/**
 *
 * @param expected
 * @param actual
 * @returns {boolean}
 */
exports.oneOf = function (actual, expected) {
  if (_.isUndefined(actual)) {
    return true;
  }

  expected = expected;
  var passed = true;

  _.each(actual, function (value) {
    if (!~expected.indexOf(value)) {
      return passed = false;
    }
  });

  return passed;
};

/**
 *
 * @param expected
 * @param actual
 * @returns {boolean}
 */
exports.typeOf = function (actual, expected) {
  if (_.isUndefined(actual)) {
    return true;
  }

  const type = expected.__proto__.type();
  var result = true;

  _.each(actual, function (item) {
    var validationStatus = type(item);

    if (!validationStatus.success) {
      result = false;
      return false;
    }
  });

  return result;
};

/**
 *
 * @param cb
 * @param value
 * @returns {*}
 */
exports.fn = function (/*args*/) {
  let args = Array.prototype.slice.call(arguments);
  let cb = args.pop();
  let actual = args.pop();

  return _.isUndefined(actual) || cb.apply(this, [actual]);
};