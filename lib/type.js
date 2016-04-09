'use strict';

const _ = require('lodash');

const TYPE_STRING = 'String';
const TYPE_NUMBER = 'Number';
const TYPE_NULL = 'Null';
const TYPE_OBJECT = 'Object';
const TYPE_ARRAY = 'Array';
const TYPE_BOOLEAN = 'Boolean';

module.exports = {
  TYPE_STRING,
  TYPE_NUMBER,
  TYPE_NULL,
  TYPE_OBJECT,
  TYPE_ARRAY,
  TYPE_BOOLEAN,

  identify,
  constructorToString
};


/**
 *
 * @param mixed {*}
 * @returns {string}
 */
function identify(mixed) {
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

  if (_.isArray(mixed)) {
    return TYPE_ARRAY;
  }

  if (_.isObject(mixed)) {
    return TYPE_OBJECT;
  }

  return 'undefined';
}

/**
 *
 * @param constructor {Constructor}
 * @returns {string}
 */
function constructorToString(constructor) {
  if (constructor === String) {
    return TYPE_STRING;
  }

  if (constructor === Number) {
    return TYPE_NUMBER;
  }

  if (constructor === Boolean) {
    return TYPE_BOOLEAN;
  }

  if (constructor === Array) {
    return TYPE_ARRAY;
  }

  if (constructor === Object) {
    return TYPE_OBJECT;
  }

  throw new Error(`Invalid constructor provided: ${constructor}`)
}