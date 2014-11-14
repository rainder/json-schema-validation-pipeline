/**
 * Created by Andrius Skerla on 12/11/14.
 * mailto: andrius@skerla.com
 */
var chai = require('chai');
var should = require('should');
var Validator = require('./../lib/validation');


function validate(object, pipeline) {
  var validator = new Validator(pipeline);
  validator.validate(object);
  return validator.errors;
}

/**
 *
 */
describe('$strict', function () {

  it('should trim values', function () {
    var o = {
      name: 'Andrius',
      surname: 'Skerla'
    };

    validate(o, [
      {$strict: true},
      {$schema: {
        name: String
      }}
    ]).should.be.length(0);

    should(o).key('name'); //should contain name property
    should(o).not.key('surname'); //should not contain surname property
  });

});