'use strict';

module.exports = {
  1: (expected, actual) => `required`,
  2: (expected, actual) => `type of the value must be ${expected}, got ${actual}.`,
  3: (expected, actual) => `the length must be >= ${expected}. Got ${actual}.`,
  4: (expected, actual) => `the length must be <= ${expected}. Got ${actual}.`,
  5: (expected, actual) => `the value must be one of ${expected}. Got ${actual}.`,
  6: (expected, actual) => `the value must be >= ${expected}. Got ${actual}.`,
  7: (expected, actual) => `the value must be <= ${expected}. Got ${actual}.`,
  8: (expected, actual) => `type of the value must be one of ${expected}, got ${actual}.`,
  9: (expected, actual) => `type of the value must be ${expected} or Null, got ${actual}.`,
};