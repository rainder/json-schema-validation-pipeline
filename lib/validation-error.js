'use strict';

module.exports = ValidationError;

function ValidationError(errors) {
  this.message = 'JSONSchemaValidationPipeline';
  this.errors = errors;
  this.type = 'ValidationError';
  this.stack = new Error(this.message).stack
}

ValidationError.prototype.toString = function () {
  return this.message;
};