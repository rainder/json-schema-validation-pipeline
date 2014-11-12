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
 * @type {Validator}
 */
module.exports = Validator;

/**
 * Main constructor
 *
 * @param pipeline {[]}
 * @constructor
 */
function Validator(pipeline) {
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
Validator.prototype.validate = function (object) {
  object = object || {};
  this.errors.length = 0;

  this.pipeline.forEach(function (pipeline) {
    var pipelineKeys = Object.keys(pipeline);

    pipelineKeys.forEach(function (pipelineKey) {
      if (this[pipelineKey] instanceof Function) {
        this[pipelineKey](object, pipeline[pipelineKey]);
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
Validator.prototype.$schema = function (object, specs) {

  Object.keys(specs).forEach(function (key) {
    var result = check(key);
    if (result !== true) {
      this.errors.push(result);
    }
  }, this);

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
 * @param specs {{}}
 */
Validator.prototype.$or = function (object, specs) {
  var exists = specs.filter(function (key) {
    return objectPath.get(object, key) !== undefined;
  });

  if (exists.length !== 1) {
    this.errors.push('One and only one of the following properties must be specified: ' + specs.join(', '))
  }
};

/**
 *
 * @param object {{}}
 * @param specs {{}}
 */
Validator.prototype.$and = function (object, specs) {
  var exists = specs.filter(function (key) {
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
Validator.prototype.$dependency = function (object, specs) {
  for (var key in specs) {
    if (!specs.hasOwnProperty(key)) { continue; }
    if (objectPath.get(object, key) === undefined) { continue; }

    var deps = _.isArray(specs[key]) ? specs[key] : [specs[key]];

    for (var item in deps) {
      if (!deps.hasOwnProperty(item)) { continue; }
      var dep = deps[item];

      if (objectPath.get(object, dep) === undefined) {
        this.errors.push('`' + key + '` depends on `' + dep + '` field.');
      }
    }
  }
};