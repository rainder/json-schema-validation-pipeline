'use strict';

const _ = require('lodash');
const utils = require('./utils');
const Rule = require('./rule');
const errorMessages = require('./../error-messages');

module.exports = class Schema {
  constructor(schema) {
    this._schema = schema;
  }

  /**
   *
   * @param object
   * @returns {{isValid: isValid, getErrors: getErrors}}
   */
  validate(object) {
    const errors = [];

    const options = {
      stopCondition: (path, value) => value instanceof Rule
    };

    utils.traverseObject(this._schema, (path, rule) => {
      const value = _.get(object, path);
      try {
        rule.check(path, value);
      } catch (e) {
        if (e instanceof Error) {
          throw e;
        }

        if (_.isArray(e)) {
          for (let item of e) {
            item.path = `${path}.${item.path}`;
            errors.push(item);
          }
        } else {
          errors[errors.length] = {
            path: e.path,
            message: errorMessages[e.id](e.expected, e.actual),
          };
        }
      }
    }, options);

    return {
      isValid: () => errors.length === 0,
      getErrors: () => errors
    };
  }
};