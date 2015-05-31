'use strict';

module.exports = exports = {};

exports.$dependency = 'Missing dependency: Key `%key` requires `%dependency`';
exports.$or = 'One of the following properties must be declared: %keys';
exports.$and = 'All of the following properties must be declared: %keys';
exports.$cast = 'Failed to cast `%keyPath` to %type';

exports.required = 'Property `%keyPath` is required';
exports.type = 'Expected `%keyPath` to be type of %type';
exports.fn = 'Validation of `%keyPath` failed';

exports.Number = {
  min: 'Expected `%keyPath` >= %expected. Got: %actual',
  max: 'Expected `%keyPath` <= %expected. Got: %actual',
  between: 'Expected `%keyPath` to be between %expected. Got: %actual',
  oneOf: 'The value of number `%keyPath` can be one of %expected. Got: %actual'
};

exports.String = {
  min: 'The length of string `%keyPath` should be greater than %expected. Got: %actual',
  max: 'The length of string `%keyPath` should be lower than %expected. Got: %actual',
  len: 'The length of string `%keyPath` should be exactly %expected. Got: %actual',
  oneOf: 'The value of string `%keyPath` can be one of %expected. Got: %actual',
  regexp: 'The value of string `%keyPath` does not match regexp %expected'
};

exports.Array = {
  min: 'The length of an array `%keyPath` should be greater than %expected. Got: %actual',
  max: 'The length of an array `%keyPath` should be lower than %expected. Got: %actual',
  len: 'The length of an array `%keyPath` should be exactly %expected. Got: %actual',
  oneOf: 'The value of an array `%keyPath` can be one of %expected. Got: %actual',
  typeOf: 'The type of the value of `%keyPath` can be only %expectedType. Got: %actualType'
};