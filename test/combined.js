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

describe('combined', function () {

  it('should work as expected. no.1', function () {
    var o = {
      id: 1,
      name: 'Andrius',
      surname: 'Skerla',
      role: 'Developer',
      address: {
        country: 'UK',
        city: 'London'
      },
      custom: [1, 2, 3]
    };

    validate(o, [
      {$schema: {
        _id: String,
        id: Number,
        name: String.required(),
        surname: String.required(),
        role: String.required().oneOf(['Developer', 'Musician']),
        address: Object,
        'address.country': String,
        'address.city': String,
        custom: function (item) { return true; }
      }},
      {$or: [
        'id', '_id'
      ]},
      {$dependency: {
        surname: 'name',
        'address.city': 'address.country'
      }}
    ]).should.be.length(0);
  });


  it('should work as expected. no.2', function () {
    validate({
      id: '1',
      name: 'Skerla',
      a: {
        b: 5,
        c: 9,
        d: 10
      },
      b: '[Object object]'
    }, [
      {$schema: {
        id: Number,
        name: String.regexp(/^Andrius$/),
        surname: String.required(),
        a: Object,
        b: Object,
        'a.b': String,
        'a.d': Number.fn(function () {
          return 'Invalid.';
        }),
        'a.c': Function.fn(function () {
          return 'Invalid 2.';
        }),
        'a.c.o': Function.required().fn(function () {
          return 'Invalid 3.';
        })
      }},
      {$dependency: {
        'a.c': 'b.a'
      }},
      {$and: ['name', 'surname']},
      {$or: ['type', 'typeId', 'TypeId']},
      {$or: ['style', 'styleId']}
    ]).should.be.length(12); //should return 10 errors
  });
});