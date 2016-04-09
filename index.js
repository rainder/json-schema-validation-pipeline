'use strict';

//const Validation = require('./lib/validation');
const Rule = require('./lib/rule');
const Schema = require('./lib/schema');

/**
 *
 * @param mixed
 */
module.exports = function (type) {
  return new Rule(type);
};

//module.exports.Pipeline = function (pipeline) {
//  return new Validation(pipeline);
//};


module.exports.Schema = Schema;