'use strict';

const _ = require('lodash');
const ValidationProcess = require('./validation-process');

module.exports = class Validation {
  /**
   *
   * @param pipeline
   */
  constructor(pipeline) {
    if (!_.isArray(pipeline)) {
      pipeline = [{ $schema: pipeline }];
    }

    this._pipeline = pipeline;
  }

  /**
   *
   * @param object
   * @returns {ValidationProcess}
   */
  validate(object) {
    return new ValidationProcess(object, this._pipeline);
  }
}