'use strict';

module.exports = exports = {};

exports.$dependency = 'Missing dependency: `%dependency`';
exports.$or = 'One of the following properties must be declared: %keys';
exports.$and = 'All of the following properties must be declared: %keys';
exports.$cast = 'Failed to cast to %type';

exports.required = 'Required';
exports.type = 'Expected to be type of %type';
exports.fn = 'Validation failed';

exports.Number = {
  min: 'Expected to be more or equal to %expected. Got: %actual',
  max: 'Expected to be less or equal to %expected. Got: %actual',
  between: 'Expected to be between %expected. Got: %actual',
  oneOf: 'Expected to be one of %expected. Got: %actual'
};

exports.String = {
  min: 'The length of the string should be greater or equal to %expected. Got: %actualLength',
  max: 'The length of the string should be lower or equal to %expected. Got: %actualLength',
  len: 'The length of the string should be exactly %expected. Got: %actualLength',
  oneOf: 'The value of the string can be one of %expected. Got: %actual',
  regexp: 'The value of the string does not match regexp %expected'
};

exports.Array = {
  min: 'The length of an array should be greater or equal to %expected. Got: %actualLength',
  max: 'The length of an array should be lower or equal to %expected. Got: %actualLength',
  len: 'The length of an array should be exactly %expected. Got: %actualLength',
  oneOf: 'The value of an array can be one of %expected. Got: %actual',
  typeOf: 'The type of the value of can be only %expectedType. Got: %actualType'
};