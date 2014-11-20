var _ = require('lodash');
var pipelineMethods = require('./pipeline-methods');


module.exports = function (pipeline) {
  return function (objectToValidate) {
    return executePipeline(objectToValidate, pipeline);
  };
};



function executePipeline(objectToValidate, pipeline) {
  var ctx = createRootContext();

  _.each(pipeline, function (pipelineItem) {
    _.each(pipelineItem, function (pipelineSpecs, pipelineMethod) {
      ctx[pipelineMethod].call(ctx, objectToValidate, pipelineSpecs);
    });
  });

  return ctx;
};

function createRootContext() {
  pipelineMethods.createContext = function createContext(pathItem) {
    var ctx = Object.create(this, {
      path: {
        value: Array.prototype.concat.call(_.clone(this.path), pathItem)
      }
    });

    return ctx;
  };

  var ctx = Object.create(pipelineMethods, {
    path: { value: [] },
    errors: { value: [] },
    isValid: {
      get: function () {
        return this.errors.length === 0;
      }
    }
  });

  return ctx;
}

