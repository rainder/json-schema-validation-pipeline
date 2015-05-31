'use strict';

module.exports = exports = {};

/**
 *
 * @param constructor
 * @returns {*}
 */
exports.getType = function getType(constructor) {
  if (!constructor) {
    return undefined;
  }

  let item = type(constructor);
  return item ? item[1] : type(constructor.constructor)[1];

  function type(mixed) {
    return mixed
      .toString()
      .match(/function ([^\(]+)/);
  }
}