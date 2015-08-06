'use strict';

var _ = require('lodash');

module.exports = exports = {};

/**
 *
 * @param actual
 * @returns {*}
 */
exports.type = function (actual) {
  return _.isUndefined(actual) || _.isBoolean(actual);
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