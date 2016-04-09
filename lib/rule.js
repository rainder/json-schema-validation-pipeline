'use strict';

const _ = require('lodash');
const type = require('./type');

module.exports = class Rule {
  constructor(constructor) {
    this._type = type.constructorToString(constructor),
    this._required = false;
    this._min = undefined;
    this._max = undefined;
    this._typeOf = undefined;
    this._oneOf = undefined;
    this._len = undefined;
    this._null = false;
    this._match = undefined;
    this._schema = undefined;
  }

  /**
   *
   * @param value
   */
  _stringCheck(path, value) {
    if (!_.isUndefined(this._min)) {
      if (this._min > value.length) {
        throw { id: 3, path, expected: this._min, actual: value.length };
      }
    }

    if (!_.isUndefined(this._max)) {
      if (this._max < value.length) {
        throw { id: 4, path, expected: this._max, actual: value.length };
      }
    }

    if (!_.isUndefined(this._len)) {
      if (this._len !== value.length) {
        throw { id: 4, path, expected: this._len, actual: value.length };
      }
    }

    if (!_.isUndefined(this._oneOf)) {
      if (!~this._oneOf.indexOf(value)) {
        throw { id: 5, path, expected: this._oneOf, actual: value };
      }
    }

    if (!_.isUndefined(this._match)) {
      if (!this._match.test(value)) {
        throw { id: 5, path, expected: this._match, actual: value };
      }
    }
  }

  /**
   *
   * @param value
   */
  _numberCheck(path, value) {
    if (!_.isUndefined(this._min)) {
      if (this._min > value) {
        throw { id: 6, path, expected: this._min, actual: value };
      }
    }

    if (!_.isUndefined(this._max)) {
      if (this._max < value) {
        throw { id: 7, path, expected: this._max, actual: value };
      }
    }

    if (!_.isUndefined(this._oneOf)) {
      if (!~this._oneOf.indexOf(value)) {
        throw { id: 5, path, expected: this._oneOf, actual: value };
      }
    }
  }

  /**
   *
   * @param value
   * @private
   */
  _objectCheck(path, value) {
    if (!_.isUndefined(this._schema)) {
      const Schema = require('./schema');
      const schema = new Schema(this._schema);
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
    if (!_.isUndefined(this._min)) {
      if (this._min > value.length) {
        throw { id: 3, path, expected: this._min, actual: value.length };
      }
    }

    if (!_.isUndefined(this._max)) {
      if (this._max < value.length) {
        throw { id: 4, path, expected: this._max, actual: value.length };
      }
    }

    if (!_.isUndefined(this._oneOf)) {
      for (let item of value) {
        if (!~this._oneOf.indexOf(item)) {
          throw { id: 5, path, expected: this._oneOf, actual: value };
        }
      }
    }

    if (!_.isUndefined(this._typeOf)) {
      const expected = type.identify(new this._typeOf());
      for (let item of value) {
        const actual = type.identify(item);
        if (actual !== expected) {
          throw { id: 8, path, expected, actual };
        }
      }
    }

    if (!_.isUndefined(this._schema)) {
      const Schema = require('./schema');
      const schema = new Schema(this._schema);
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
    this._required = true;
    return this;
  }

  /**
   *
   * @param length
   * @returns {Rule}
   */
  min(length) {
    this._min = length;
    return this;
  }

  /**
   *
   * @param length
   * @returns {Rule}
   */
  max(length) {
    this._max = length;
    return this;
  }

  /**
   *
   * @param array {Array}
   * @returns {Rule}
   */
  oneOf(array) {
    this._oneOf = array;
    return this;
  }

  /**
   *
   * @param type
   * @returns {Rule}
   */
  typeOf(type) {
    this._typeOf = type;
    return this;
  }

  /**
   *
   * @param schema {Object}
   * @returns {Rule}
   */
  schema(schema) {
    this._schema = schema;
    return this;
  }

  /**
   *
   * @param regexp {RegExp}
   * @returns {Rule}
   */
  match(regexp) {
    this._match = regexp;
    return this;
  }

  /**
   *
   * @returns {Rule}
   */
  null() {
    this._null = true;
    return this;
  }

  /**
   *
   * @param value
   * @returns {Rule}
   */
  len(value) {
    this._len = value;
    return this;
  }

  /**
   *
   * @param value
   * @returns {boolean}
   */
  check(path, value) {
    if (!this._required && value === undefined) {
      return true;
    }

    if (this._null && value === null) {
      return true;
    }

    if (this._required && value === undefined) {
      throw { id: 1, path };
    }

    if (this._type !== type.identify(value)) {
      if (this._null) {
        throw { id: 9, path, expected: this._type, actual: type.identify(value) };
      } else {
        throw { id: 2, path, expected: this._type, actual: type.identify(value) };
      }
    }

    if (this._type === type.TYPE_STRING) {
      this._stringCheck(path, value);
    }

    if (this._type === type.TYPE_NUMBER) {
      this._numberCheck(path, value);
    }

    if (this._type === type.TYPE_OBJECT) {
      this._objectCheck(path, value);
    }

    if (this._type === type.TYPE_ARRAY) {
      this._arrayCheck(path, value);
    }

    return true;
  }
};