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
      surname: 'Skerla',
      age: 26
    };

    validate(o, [
      {$strict: true},
      {$schema: {
        name: String,
        age: 26
      }}
    ]);


    should(o).key(['name', 'age']); //should contain name property
  });


  it('should trim values', function () {
    var o = {
      name: 'Andrius',
      surname: 'Skerla',
      address: {
        country: 'UK',
        city: 'London'
      }
    };

    validate(o, [
      {$strict: true},
      {$schema: {
        name: String,
        address: Object,
        'address.country': String
      }}
    ]);


    should(o).key(['name', 'address']); //should contain name and address property
    should(o.address).key(['country']);
  });

});