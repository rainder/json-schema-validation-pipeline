'use strict';

const map = new Map();
map.set(Object, require('./Object'));
map.set(Array, require('./Array'));
map.set(Number, require('./Number'));
map.set(String, require('./String'));
map.set(Function, require('./Function'));
map.set(Boolean, require('./Boolean'));

module.exports = exports = function (type) {
  let name = type.toString().match(/function ([a-z]+)/i)[1];
  let validationFunctions = map.get(type);
  Validate._constructor = name;
  Validate._functions = validationFunctions;
  Validate._config = {
    type: type
  };

  for (let validationFunctionName in validationFunctions) {
    Validate[validationFunctionName] = function (value) {
      this._config[validationFunctionName] = value;
      return this;
    };
  }

  return Validate;

  function Validate(actual) {
    let result = [];

    for (let validationFunctionName in Validate._config) {
      let args = [actual, Validate._config[validationFunctionName]];
      let validationResult = validationFunctions[validationFunctionName].apply(this, args);

      if (validationResult === false) {
        result.push({
          name: validationFunctionName,
          expected: Validate._config[validationFunctionName],
          actual: args[0]
        });
      }
    }

    return result;
  }
};


//exports.any = function (rules) {
//  return function (obj, key) {
//
//    for (let rule of rules) {
//      console.log(rule._functions.type);
//      let result = rule._config.type(obj[key]);
//
//      console.log(result);
//    }
//
//  }
//}