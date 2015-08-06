const _ = require('lodash');
const context = require('./lib/context');
const V = require('./lib/validation');

module.exports = exports = jsonSchemaValidationPipeline;

exports.V = V;

/**
 *
 * @param pipeline
 * @returns {function(this:null)}
 */
function jsonSchemaValidationPipeline(pipeline) {
  return _.bind(executePipeline, null, pipeline);
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

