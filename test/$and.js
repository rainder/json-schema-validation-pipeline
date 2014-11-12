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
describe('$and', function () {

  it('should pass', function () {
    var pipeline = [
      {$and: ['name', 'surname']}
    ];

    validate({

    }, pipeline).should.be.length(0);

    validate({
      name: 'Andrius',
      surname: 'Skerla'
    }, pipeline).should.be.length(0);
  });

  it('should fail', function () {
    var pipeline = [
      {$and: ['name', 'surname']}
    ];

    validate({
      name: 'Andrius'
    }, pipeline).should.be.length(1);

    validate({
      surname: 'Skerla'
    }, pipeline).should.be.length(1);
  });

});