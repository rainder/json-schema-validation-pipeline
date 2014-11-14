/**
 * Created by Andrius Skerla on 14/11/14.
 * mailto: andrius@skerla.com
 */

var _ = require('lodash');
var checks = require('./checks');
var Spec = require('./schemaSpec');
var objectPath = require('object-path');


var ValidationPipelineMethods = {};

module.exports = ValidationPipelineMethods ;


/**
 *
 * @param object
 * @param specs
 */
ValidationPipelineMethods.$strict = function (object, specs) {
  this.strict = !!specs;
};

/**
 *
 * @param object {{}}
 * @param specs {{}}
 */
ValidationPipelineMethods.$schema = function (object, specs) {
  var self = this;

  _.each(specs, function (dummy, key) {
    var result = check(key);

    if (result) {
      self.errors.push(result);
    }
  });

  if (this.strict) {

    var unwantedPropertyPaths = [];
    deepEach(object, function (value, keyPath) {
      if (!specs.hasOwnProperty(keyPath)) {
        unwantedPropertyPaths.push(keyPath);
      }
    });

    unwantedPropertyPaths.forEach(function (propertyPath) {
      objectPath.del(object, propertyPath)
    });
  }

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
        return;
      }
    }

    var result = (function () {

      if (type === Number) {
        return checks.checkNumber.call(self, key, value, spec, object);
      }

      if (type === String) {
        return checks.checkString.call(self, key, value, spec, object);
      }

      if (type === Object) {
        return checks.checkObject.call(self, key, value, spec, object);
      }

      if (type === Boolean) {
        return checks.checkBoolean.call(self, key, value, spec, object);
      }

      if (type === Function) {
        return checks.checkFunction.call(self, key, value, spec, object);
      }

      if (type === Array) {
        return checks.checkArray.call(self, key, value, spec, object);
      }

      if (type instanceof Function) {
        return type.call(self, value, key, object);
      }

    })();


    if (!result && spec.hasOwnProperty('fn')) {
      var temp = self.keyPrefix;
      self.keyPrefix += self.keyPrefix ? '.' + key : key;
      result = spec.fn.call(self, value, self.keyPrefix, object);
      self.keyPrefix = temp;
    }

    return result;
  }
};

/**
 *
 * @param object {{}}
 * @param specs {[]}
 */
ValidationPipelineMethods.$or = function (object, specs) {
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
ValidationPipelineMethods.$and = function (object, specs) {
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
ValidationPipelineMethods.$dependency = function (object, specs) {
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

/**
 *
 * @param object
 * @param callback
 */
function deepEach(object, callback) {
  (function traverseObject(object, path) {
    _.each(object, function (value, key) {
      var keyPath = path ? path + '.' + key : key;
      if (_.isObject(value)) {
        traverseObject(value, keyPath);
      } else {
        callback(value, keyPath);
      }
    });
  })(object, '');
}