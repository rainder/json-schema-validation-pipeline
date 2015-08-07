'use strict';

const _ = require('lodash');
const objectDeep = require('object-deep');
const messages = require('./../../messages');

module.exports = $dependency;

/**
 *
 * @param objectToValidate
 * @param specs
 */
function $dependency(objectToValidate, specs) {
  for (let key of Object.keys(specs)) {
    if (objectDeep.get(objectToValidate, key) === undefined) {
      continue;
    }

    let deps = specs[key];
    deps = _.isArray(deps) ? deps : [deps];

    for (let dep of deps) {
      if (objectDeep.get(objectToValidate, dep) === undefined) {
        let message = messages['$dependency']
          .replace('%key', key)
          .replace('%dependency', dep);

        this.errors['$dependency'] = message;
      }
    }
  }

  return this;
}