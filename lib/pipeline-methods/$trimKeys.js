'use strict';

module.exports = $trimKeys;

/**
 *
 * @param objectToValidate
 * @param specs
 * @returns {$trimKeys}
 */
function $trimKeys(objectToValidate, specs) {
  for (let key of Object.keys(objectToValidate)) {
    if (!~specs.indexOf(key)) {
      delete objectToValidate[key];
    }
  }

  return this;
}