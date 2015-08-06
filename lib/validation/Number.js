'use strict';

var _ = require('lodash');

module.exports = exports = {};

/**
 *
 * @param actual {Number}
 * @returns {*}
 */
exports.type = function (actual) {
  return _.isUndefined(actual) || _.isNumber(actual);
};

/**
 *
 * @param actual {Number}
 * @returns {*}
 */
exports.required = function (actual) {
  return !_.isUndefined(actual);
};

/**
 *
 * @param expected {Number}
 * @param actual {Number}
 * @returns {boolean}
 */
exports.min = function (actual, expected) {
  return _.isUndefined(actual) || actual >= expected;
};

/**
 *
 * @param expected {Number}
 * @param actual {Number}
 * @returns {boolean}
 */
exports.max = function (actual, expected) {
  return _.isUndefined(actual) || actual <= expected;
};

/**
 *
 * @param expected {Array}
 * @param actual {Number}
 * @returns {boolean}
 */
exports.between = function (actual, expected) {
  return _.isUndefined(actual) || (actual >= expected[0] && actual <= expected[1]);
};

/**
 *
 * @param expected {Array}
 * @param actual {Number}
 * @returns {boolean}
 */
exports.oneOf = function (actual, expected) {
  return _.isUndefined(actual) || !!~expected.indexOf(actual);
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
}