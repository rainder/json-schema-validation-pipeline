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
   * @private
   */
  _cleanupObject(object) {
    const result = {};
    const paths = Object.keys(this._schema);

    for (let path of paths) {
      const objectPath = path.replace(/\._schema/g, '');
      const schemaValue = _.get(this._schema, path);
      const objectValue = _.get(object, objectPath);

      if (schemaValue instanceof Rule) {
        if (schemaValue._schema) {
          const keys = Object.keys(schemaValue._schema);
          paths.push.apply(paths, keys.map(item => `${path}._schema.${item}`));
        } else {
          _.set(result, objectPath, objectValue);
        }
      } else if (schemaValue instanceof Object) {
        const keys = Object.keys(schemaValue);
        paths.push.apply(paths, keys.map(item => `${path}.${item}`));
      } else {
        _.set(result, objectPath, objectValue);
      }
    }

    return result;
  }

  /**
   *
   * @param object
   * @returns {{isValid: isValid, getErrors: getErrors}}
   */
  validate(object) {
    const errors = [];

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
    }, {
      stopCondition: (path, value) => value instanceof Rule
    });

    return {
      isValid: () => errors.length === 0,
      getErrors: () => errors,
      getClean: () => this._cleanupObject(object)
    };
  }
};
