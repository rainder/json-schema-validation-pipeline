'use strict';

const _ = require('lodash');

const TYPE_STRING = 'String';
const TYPE_NUMBER = 'Number';
const TYPE_NULL = 'Null';
const TYPE_OBJECT = 'Object';
const TYPE_ARRAY = 'Array';
const TYPE_BOOLEAN = 'Boolean';

module.exports = class Rule {
  constructor(type) {
    this._flags = {
      type: type,
      required: false
    };
  }

  /**
   *
   * @param value
   */
  _stringCheck(path, value) {
    if (!_.isString(value)) {
      throw { id: 2, path, expected: TYPE_STRING, actual: getType(value) };
    }

    if (!_.isUndefined(this._flags.min)) {
      if (this._flags.min > value.length) {
        throw { id: 3, path, expected: this._flags.min, actual: value.length };
      }
    }

    if (!_.isUndefined(this._flags.max)) {
      if (this._flags.max < value.length) {
        throw { id: 4, path, expected: this._flags.max, actual: value.length };
      }
    }

    if (!_.isUndefined(this._flags.oneOf)) {
      if (!~this._flags.oneOf.indexOf(value)) {
        throw { id: 5, path, expected: this._flags.oneOf, actual: value };
      }
    }

    if (!_.isUndefined(this._flags.match)) {
      if (!this._flags.match.test(value)) {
        throw { id: 5, path, expected: this._flags.match, actual: value };
      }
    }
  }

  /**
   *
   * @param value
   */
  _numberCheck(path, value) {
    if (!_.isNumber(value)) {
      throw { id: 2, path, expected: TYPE_NUMBER, actual: getType(value) };
    }

    if (!_.isUndefined(this._flags.min)) {
      if (this._flags.min > value) {
        throw { id: 6, path, expected: this._flags.min, actual: value };
      }
    }

    if (!_.isUndefined(this._flags.max)) {
      if (this._flags.max < value) {
        throw { id: 7, path, expected: this._flags.max, actual: value };
      }
    }

    if (!_.isUndefined(this._flags.oneOf)) {
      if (!~this._flags.oneOf.indexOf(value)) {
        throw { id: 5, path, expected: this._flags.oneOf, actual: value };
      }
    }
  }

  /**
   *
   * @param value
   * @private
   */
  _objectCheck(path, value) {
    if (!_.isObject(value)) {
      throw { id: 2, path, expected: TYPE_OBJECT, actual: getType(value) };
    }

    if (!_.isUndefined(this._flags.schema)) {
      const Schema = require('./schema');
      const schema = new Schema(this._flags.schema);
      const result = schema.validate(value);
      if (!result.isValid()) {
        throw result.getErrors();
      }
    }
  }

  /**
   *
   * @param value
   * @private
   */
  _arrayCheck(path, value) {
    if (!_.isArray(value)) {
      throw { id: 2, path, expected: TYPE_ARRAY, actual: getType(value) };
    }

    if (!_.isUndefined(this._flags.min)) {
      if (this._flags.min > value.length) {
        throw { id: 3, path, expected: this._flags.min, actual: value.length };
      }
    }

    if (!_.isUndefined(this._flags.max)) {
      if (this._flags.max < value.length) {
        throw { id: 4, path, expected: this._flags.max, actual: value.length };
      }
    }

    if (!_.isUndefined(this._flags.oneOf)) {
      for (let item of value) {
        if (!~this._flags.oneOf.indexOf(item)) {
          throw { id: 5, path, expected: this._flags.oneOf, actual: value };
        }
      }
    }

    if (!_.isUndefined(this._flags.typeOf)) {
      const expected = getType(new this._flags.typeOf());
      for (let item of value) {
        const actual = getType(item);
        if (actual !== expected) {
          throw { id: 8, path, expected, actual };
        }
      }
    }

    if (!_.isUndefined(this._flags.schema)) {
      const Schema = require('./schema');
      const schema = new Schema(this._flags.schema);
      for (let item of value) {
        const result = schema.validate(item);
        if (!result.isValid()) {
          throw result.getErrors();
        }
      }
    }
  }

  /**
   *
   * @returns {Rule}
   */
  required() {
    this._flags['required'] = true;
    return this;
  }

  /**
   *
   * @param length
   * @returns {Rule}
   */
  min(length) {
    this._flags['min'] = length;
    return this;
  }

  /**
   *
   * @param length
   * @returns {Rule}
   */
  max(length) {
    this._flags['max'] = length;
    return this;
  }

  /**
   *
   * @param array {Array}
   * @returns {Rule}
   */
  oneOf(array) {
    this._flags['oneOf'] = array;
    return this;
  }

  /**
   *
   * @param type
   * @returns {Rule}
   */
  typeOf(type) {
    this._flags['typeOf'] = type;
    return this;
  }

  /**
   *
   * @param schema {Object}
   * @returns {Rule}
   */
  schema(schema) {
    this._flags['schema'] = schema;
    return this;
  }

  /**
   *
   * @param regexp {RegExp}
   * @returns {Rule}
   */
  match(regexp) {
    this._flags.match = regexp;
    return this;
  }

  /**
   *
   * @param value
   * @returns {boolean}
   */
  check(path, value) {
    if (this._flags.required && value === undefined) {
      throw { id: 1, path };
    }

    if (!this._flags.required && value === undefined) {
      return true;
    }

    if (this._flags.type === String) {
      this._stringCheck(path, value);
    }

    if (this._flags.type === Number) {
      this._numberCheck(path, value);
    }

    if (this._flags.type === Object) {
      this._objectCheck(path, value);
    }

    if (this._flags.type === Array) {
      this._arrayCheck(path, value);
    }

    return true;
  }
};

/**
 *
 * @param mixed
 * @returns {*}
 */
function getType(mixed) {
  if (_.isString(mixed)) {
    return TYPE_STRING;
  }

  if (_.isNumber(mixed)) {
    return TYPE_NUMBER;
  }

  if (_.isNull(mixed)) {
    return TYPE_NULL;
  }

  if (_.isBoolean(mixed)) {
    return TYPE_BOOLEAN;
  }

  if (_.isObject(mixed)) {
    return TYPE_OBJECT;
  }

  if (_.isArray(mixed)) {
    return TYPE_ARRAY;
  }

  return 'undefined';
}