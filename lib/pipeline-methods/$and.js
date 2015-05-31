'use strict';

const messages = require('./../../messages');
const objectDeep = require('object-deep');

module.exports = $and;

/**
 *
 * @param objectToValidate
 * @param specs
 * @returns {$and}
 */
function $and(objectToValidate, specs) {
  let found = 0;

  for (let key of specs) {
    if (objectDeep.get(objectToValidate, key) !== undefined) {
      found++;
    }
  }

  if (found !== specs.length) {
    let message = messages['$and']
      .replace('%keys', specs.join(', '));
    this.errors.push(message)
  }

  this.success = this.errors.length === 0;
  return this;
}