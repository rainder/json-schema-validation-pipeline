/**
 * Created by Andrius Skerla on 12/11/14.
 * mailto: andrius@skerla.com
 */
var chai = require('chai');
var should = require('should');
var Validator = require('./../');
var expect = chai.expect;


function validate(object, pipeline) {
  var validator = Validator(pipeline);
  var result = validator(object);
  return result.errors;
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


  it('should break on specified object level', function () {
    var o = {
      l1: {
        l2: {
          a: {},
          b: {},
          c: {}
        },
        k2: {}
      },
      u2: 7
    };

    validate(o, [
      {$strict: {enabled: true, level: 2}},
      {$schema: {
        l1: Object,
        'l1.l2': Object
      }}
    ]);

    expect(o).keys('l1');
    expect(o.l1).keys('l2');
    expect(o.l1.l2).keys(['a', 'b', 'c']);

  });


  it('should break on specified object level 2', function () {
    var o = {
      l1: {
        l2: {
          a: {
            o: 8
          },
          b: {},
          c: {}
        },
        k2: {}
      },
      u2: 7
    };

    validate(o, [
      {$strict: {enabled: true, level: 2}},
      {$schema: {
        l1: Object,
        'l1.l2': Object.fn(function (value, key) {

          this.$strict({enabled: true, level: 1});
          this.$schema(value, {
            a: Object
          });

        })
      }}
    ]);

    expect(o).keys('l1');
    expect(o.l1).keys('l2');
    expect(o.l1.l2).keys(['a']);
    expect(o.l1.l2.a).keys(['o']);

  });

});