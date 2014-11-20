/**
 * Created by Andrius Skerla on 19/11/14.
 * mailto: andrius@skerla.com
 */

var _ = require('lodash');

var interfaceMap = [
  {
    builder: require('./String'),
    constructor: String
  }
]


_.each(interfaceMap, function (spec) {

  _.each(spec.builder.methods, function (method, methodName) {
    spec.constructor[methodName] = function constructor() {
      var proto = {
        fn: function (callback) {
          this.fn = callback;
          return Validator;
        },
        __proto__: Function.prototype
      };

      function Validator(value) {
        var keys = Object.keys(Validator);
        var ctx = this;

        for (var i = 0; i < keys.length; i++) {
          var validationFunctionName = keys[i];
          var validate = Validator[validationFunctionName];
          var result = validate.call(ctx, value);
          if (result !== true) {
            if (spec.constructor.hasOwnProperty(validationFunctionName) && spec.constructor[validationFunctionName].message) {
              return spec.constructor[validationFunctionName].message;
            }

            if (spec.builder.messages.hasOwnProperty(validationFunctionName) && spec.builder.messages[validationFunctionName]) {
              return spec.builder.messages[validationFunctionName];
            }

            if (result !== undefined) {
              return result;
            }
          }
        }

        return null;
      }

      Validator.__proto__ = proto;

      _.each(spec.builder.methods, function (method, name) {
        proto[name] = function () {
          method.apply(Validator, arguments);
          return Validator;
        };
      });


      if (methodName !== 'type') {
        Validator['type'].call(Validator);
      }

      Validator[methodName].apply(Validator, arguments);
      return Validator;
    };
  });

});

