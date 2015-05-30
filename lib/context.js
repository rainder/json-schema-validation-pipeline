'use strict';
var pipelineMethods = require('./pipeline-methods/index');

module.exports = function createContext() {
  var context = Object.create(pipelineMethods, {
    isValid: {
      get: function () {
        return this.errors.length === 0;
      }
    }
  });

  context.errors = [];
  return context;
};