'use strict';

module.exports = exports = {};

exports.$dependency = 'Missing dependency: Key `%key` requires `%dependency`';
exports.$or = 'One of the following properties must be declared: %keys';
exports.$and = 'All of the following properties must be declared: %keys';

exports.required = 'Property `%keyPath` is required';
exports.type = 'Expected `%keyPath` to be type of %type';
exports.fn = 'FN failed';

exports.Number = {
  min: 'Expected `%keyPath` >= %expected. Got: %actual',
  max: 'Expected `%keyPath` <= %expected. Got: %actual',
  between: 'Expected `%keyPath` to be between %expected. Got: %actual'
};