'use strict';

const _ = require('lodash');
const objectDeep = require('object-deep');

module.exports = $trim;

/**
 *
 * @param objectToValidate
 * @param specs
 * @returns {$trim}
 */
function $trim(objectToValidate, specs) {
  if (!_.isPlainObject(objectToValidate)) {
    return this;
  }

  for (let key of specs) {
    let value = objectDeep.get(objectToValidate, key);
    if (_.isString(value)) {
      objectDeep.set(objectToValidate, key, value.trim());
    }
  }

  return this;
}