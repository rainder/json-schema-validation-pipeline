'use strict';

const _ = require('lodash');

module.exports = $trimKeys;

/**
 *
 * @param objectToValidate
 * @param specs
 * @returns {$trimKeys}
 */
function $trimKeys(objectToValidate, specs) {
  if (!_.isPlainObject(objectToValidate)) {
    return this;
  }

  for (let key of Object.keys(objectToValidate)) {
    if (!~specs.indexOf(key)) {
      delete objectToValidate[key];
    }
  }

  return this;
}