'use strict';

const _ = require('lodash');
const utils = require('./utils');
const Rule = require('./rule');

module.exports = class ValidationProcess {
  constructor(object, pipeline) {
    this._object = object;
    this._pipeline = pipeline;
    this._isValid = true;

    this._validate();
  }

  _validate() {
    for (let item of this._pipeline) {
      const keys = Object.keys(item);
      console.assert(keys.length === 1, 'pipeline item can contain only one key');
      const method = keys[0];
      const params = item[method];

      if (!$schema(this._object, params)) {
        this._isValid = false;
      };
    }
  }

  /**
   * 
   * @returns {boolean}
   */
  isValid() {
    return this._isValid;
  }
};