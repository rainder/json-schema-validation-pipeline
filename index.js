const _ = require('lodash');
const context = require('./lib/context');

module.exports = jsonSchemaValidationPipeline;

/**
 *
 * @param pipeline
 * @returns {function(this:null)}
 */
function jsonSchemaValidationPipeline(pipeline) {
  return executePipeline.bind(null, pipeline);
}

/**
 *
 * @param pipeline
 * @param objectToValidate
 * @returns {*}
 */
function executePipeline(pipeline, objectToValidate) {
  var ctx = context();

  _.each(pipeline, function (pipelineItem) {
    _.each(pipelineItem, function (pipelineSpecs, pipelineMethod) {
      ctx[pipelineMethod].call(ctx, objectToValidate, pipelineSpecs);
    });
  });

  return ctx;
};

