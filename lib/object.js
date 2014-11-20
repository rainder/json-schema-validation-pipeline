/**
 * Created by Andrius Skerla on 19/11/14.
 * mailto: andrius@skerla.com
 */
var _ = require('lodash');

module.exports = exports = {};

/**
 *
 * @param object
 * @param objectPath
 * @returns {*}
 */
exports.get = function (object, objectPath) {
  var path = objectPath.split('.');
  var pathItem;

  while (path.length) {
    pathItem = path.shift();
    if (!object.hasOwnProperty(pathItem)) {
      return undefined;
    }

    object = object[pathItem];
  }

  return object;
};

/**
 *
 * @param object
 * @param objectPath
 * @returns {*}
 */
exports.del = function (object, objectPath) {
  var objectPointer = object;
  var path = objectPath.split('.');
  var pathItem;

  while (path.length > 1) {
    pathItem = path.shift();
    if (!objectPointer.hasOwnProperty(pathItem)) {
      return undefined;
    }

    objectPointer = objectPointer[pathItem];
  }

  if (_.isArray(objectPointer)) {
    objectPointer.splice(path.shift(), 1);
  } else {
    delete objectPointer[path.shift()];
  }

  return object;
}

/**
 *
 * @param object {{}}
 * @param callback {Function}
 * @param (maxLevel) {Number}
 */
exports.eachDeep = function (object, callback, maxLevel) {

  (function goDeeper(object, keyPath, level) {
    if (maxLevel && level > maxLevel) {
      return;
    }

    _.each(object, function (value, key) {
      keyPath += keyPath ? '.' + key : key;

      if (_.isObject(value)) {
        goDeeper(value, keyPath, level + 1);
        callback(value, key, keyPath);
      } else {
        callback(value, key, keyPath);
      }

    });

  })(object, '', 1);

};