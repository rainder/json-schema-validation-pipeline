'use strict';

const pipelineMethods = require('./pipeline-methods');

module.exports = createContext;

/**
 *
 * @returns {Object}
 */
function createContext() {
  var context = Object.create(pipelineMethods, {
    isValid: {
      get: function () {
        return this.errors.length === 0;
      }
    }
  });

  context.errors = [];
  return context;
}