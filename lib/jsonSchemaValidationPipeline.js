/**
 * Created by Andrius Skerla on 12/11/14.
 * mailto: andrius@skerla.com
 */

var _ = require('lodash');
var ValidationPipelineMethods = require('./ValidationPipelineMethods');

/**
 * Exports
 *
 * @type {ValidationPipeline}
 */
module.exports = ValidationPipelineConstructor;

function ValidationPipelineConstructor(pipeline) {
  pipeline = !_.isArray(pipeline) ? [pipeline] : pipeline;

  /**
   *
   */
  return function (object) {
    object = object || {};

    /**
     *
     * @type {ValidationPipelineMethods}
     */
    var validator = Object.create(ValidationPipelineMethods, {
      errors: { value: [] },
      isValid: {
        get: function () {
          return this.errors.length === 0;
        }
      }
    });

    /**
     * Traverse pipeline
     */
    pipeline.forEach(pipelineItem);

    return validator;

    /**
     *
     * @param pipelineItem
     */
    function pipelineItem(pipelineItem) {
      Object.keys(pipelineItem).forEach(function (pipelineKey) {
        if (validator[pipelineKey] instanceof Function) {
          validator[pipelineKey](object, pipelineItem[pipelineKey]);
        } else {
          var dummy = {};
          dummy[pipelineKey] = pipelineItem[pipelineKey];
          validator.$schema(object, dummy);
        }
      });
    }
  }
}
