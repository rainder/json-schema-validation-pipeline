const _ = require('lodash');
const context = require('./context');
const ValidationError = require('./validation-error');


module.exports = function (pipeline) {
  return function (objectToValidate) {
    return executePipeline(objectToValidate, pipeline);
  };
};



function executePipeline(objectToValidate, pipeline) {
  var ctx = context();

  _.each(pipeline, function (pipelineItem) {
    _.each(pipelineItem, function (pipelineSpecs, pipelineMethod) {
      ctx[pipelineMethod].call(ctx, objectToValidate, pipelineSpecs);
    });
  });

  //if (!ctx.success) {
  //  throw new ValidationError(ctx.errors);
  //}

  return ctx;
};

