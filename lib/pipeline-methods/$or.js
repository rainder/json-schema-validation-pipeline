'use strict';

const messages = require('./../../messages');
const objectDeep = require('object-deep');

module.exports = $or;

/**
 *
 * @param objectToValidate
 * @param specs
 * @returns {$or}
 */
function $or(objectToValidate, specs) {
  let found = 0;

  for (let key of specs) {
    if (objectDeep.get(objectToValidate, key) !== undefined) {
      found++;
    }
  }

  if (!found) {
    let message = messages['$or']
      .replace('%keys', specs.join(', '));
    this.errors.push(message)
  }

  return this;
}