/**
 * Created by Andrius Skerla on 12/11/14.
 * mailto: andrius@skerla.com
 */

var _ = require('lodash');
var checks = require('./checks');
var Spec = require('./schemaSpec');
var objectPath = require('object-path');

/**
 * Exports
 *
 * @type {ValidationPipeline}
 */
module.exports = ValidationPipeline;

/**
 * Main constructor
 *
 * @param pipeline {[]}
 * @constructor
 */
function ValidationPipeline(pipeline) {
  this.pipeline = pipeline || [];
  this.errors = [];

  Object.defineProperty(this, 'isValid', {
    get: function () {
      return this.errors.length === 0;
    }
  });
}

/**
 *
 * @param object {{}}
 * @returns {boolean}
 */
ValidationPipeline.prototype.validate = function (object) {
  object = object || {};
  this.errors.length = 0;

  this.pipeline.forEach(function (pipeline) {
    var pipelineKeys = Object.keys(pipeline);

    pipelineKeys.forEach(function (pipelineKey) {
      if (this[pipelineKey] instanceof Function) {
        this[pipelineKey](object, pipeline[pipelineKey]);
      } else {
        throw new Error('Unknown pipeline method provided: ' + pipelineKey);
      }
    }, this);

  }, this);

  return this.isValid;
};

/**
 *
 * @param object {{}}
 * @param specs {{}}
 */
ValidationPipeline.prototype.$schema = function (object, specs) {
  var self = this;

  _.each(specs, function (dummy, key) {
    var result = check(key);
    if (result !== true) {
      self.errors.push(result);
    }
  });

  /**
   *
   * @param key
   * @returns {*}
   */
  function check(key) {
    var spec = specs[key];
    var type = spec._type || spec;
    var value = objectPath.get(object, key);

    if (!(spec instanceof Spec)) {
      spec = {};
    }

    if (value === undefined) {
      if (spec.hasOwnProperty('required') && spec.required === true) {
        return '`' + key + '` is required';
      } else {
        return true;
      }
    }

    if (type === Number) {
      return checks.checkNumber(key, value, spec);
    }

    if (type === String) {
      return checks.checkString(key, value, spec);
    }

    if (type === Object) {
      return checks.checkObject(key, value, spec);
    }

    if (type === Boolean) {
      return checks.checkBoolean(key, value, spec);
    }

    if (type === Function) {
      return checks.checkFunction(key, value, spec);
    }

    if (type instanceof Function) {
      return type(value);
    }

    return undefined;
  }
};

/**
 *
 * @param object {{}}
 * @param specs {[]}
 */
ValidationPipeline.prototype.$or = function (object, specs) {
  var exists = _.filter(specs, function (key) {
    return objectPath.get(object, key) !== undefined;
  });

  if (exists.length !== 1) {
    this.errors.push('One and only one of the following properties must be specified: ' + specs.join(', '))
  }
};

/**
 *
 * @param object {{}}
 * @param specs {[]}
 */
ValidationPipeline.prototype.$and = function (object, specs) {
  var exists = _.filter(specs, function (key) {
    return objectPath.get(object, key) !== undefined;
  });

  if (exists.length !== specs.length && exists.length !== 0) {
    this.errors.push('All or none of the following properties must be specified: ' + specs.join(', '))
  }
};

/**
 *
 * @param object {{}}
 * @param specs {{}}
 */
ValidationPipeline.prototype.$dependency = function (object, specs) {
  var self = this;

  _.each(specs, function (spec, key) {
    if (objectPath.get(object, key) === undefined) {
      return;
    }

    var dependencies = _.isArray(spec) ? spec : [spec];

    _.each(dependencies, function (dep) {
      if (objectPath.get(object, dep) === undefined) {
        self.errors.push('`' + key + '` depends on `' + dep + '` field.');
      }
    });
  });
};