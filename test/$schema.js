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
describe('$schema', function () {

  it('Number', function () {
    var o = {
      id: 4,
      name: 'hey'
    };

    validate(o, [
      {$schema: {
        id: Number
      }}
    ]).should.be.length(0);

    validate(o, [
      {$schema: {
        id: Number.required().min(4).max(4)
      }}
    ]).should.be.length(0);

    validate(o, [
      {$schema: {
        id: Number.required().min(5),
        name: Number
      }}
    ]).should.be.length(2);

    validate({id: 'asd'}, [
      {$schema: {
        id: Number
      }}
    ]).should.be.length(1);

    validate({}, [
      {$schema: {
        id: Number.required()
      }}
    ]).should.be.length(1);

    validate({
      type: 'Big'
    }, [
      {$schema: {
        type: String.oneOf(['Big', 'Small', 'Medium'])
      }}
    ]).should.be.length(0);

    validate({
      type: 'Tiny'
    }, [
      {$schema: {
        type: String.oneOf(['Big', 'Small', 'Medium'])
      }}
    ]).should.be.length(1);


  });

  it('String', function () {
    var o = {id: 5, name: 'hello world'};

    validate(o, [
      {$schema: {
        name: String
      }}
    ]).should.be.length(0);

    validate(o, [
      {$schema: {
        name: String.min(20)
      }}
    ]).should.be.length(1);

    validate(o, [
      {$schema: {
        name: String.max(1)
      }}
    ]).should.be.length(1);

    validate(o, [
      {$schema: {
        name: String.regexp(/hello/)
      }}
    ]).should.be.length(0);

    validate(o, [
      {$schema: {
        name: String.regexp(/hello^/)
      }}
    ]).should.be.length(1);

    validate(o, [
      {$schema: {
        name: String.len(11)
      }}
    ]).should.be.length(0);

    validate(o, [
      {$schema: {
        name: String.len(1)
      }}
    ]).should.be.length(1);

  });

  it('Boolean', function () {

    validate({
      yes: true
    }, [
      {$schema: {
        yes: Boolean
      }}
    ]).should.be.length(0);

    validate({
    }, [
      {$schema: {
        yes: Boolean.required()
      }}
    ]).should.be.length(1);

    validate({
      yes: 'true'
    }, [
      {$schema: {
        yes: Boolean
      }}
    ]).should.be.length(1);

  });

  it.only('Array', function () {

    validate({
      value: []
    }, [
      {$schema: {
        value: Array.min(0)
      }}
    ]).should.be.length(0);

    validate({
      value: [1]
    }, [
      {$schema: {
        value: Array.min(1)
      }}
    ]).should.be.length(0);

    validate({
      value: [1, 2]
    }, [
      {$schema: {
        value: Array.max(1)
      }}
    ]).should.be.length(1);

    validate({
      value: [1, 2, 3]
    }, [
      {$schema: {
        value: Array.len(1)
      }}
    ]).should.be.length(1);

    validate({
      value: [1, 2, 3]
    }, [
      {$schema: {
        value: Array.len(3).oneOf([1, 2])
      }}
    ]).should.be.length(1);

    validate({
      value: [1, 2, 3]
    }, [
      {$schema: {
        value: Array.typeOf(Number)
      }}
    ]).should.be.length(0);

    validate({
      value: ['1', '2', 3]
    }, [
      {$schema: {
        value: Array.typeOf(String)
      }}
    ]).should.be.length(1);


    validate({
      value: [1, 2, 3, 0]
    }, [
      {$schema: {
        value: Array.typeOf(Number.min(1))
      }}
    ]).should.be.length(1);

  });

  it('Function', function () {

    var arr = [1, 2, 3, 4];

    validate({
      custom: arr
    }, [
      {$schema: {
        custom: Function.required().fn(function (item) {
          return item === arr ? true : 'Not the same!';
        })
      }}
    ]).should.be.length(0);

    validate({
      custom: [1, 2, 3, 4]
    }, [
      {$schema: {
        custom: Function.required().fn(function () {
          return 'Not valid';
        }),
        custom2: Function.required().fn(function () {
          return 'Not valid2';
        })
      }}
    ]).should.be.length(2);

    var o = {
      custom: [1, 2, 3, 4]
    };
    validate(o, [
      {$schema: {
        custom: Function.fn(function (value, key, object) {
          this.should.be.instanceOf(Validator);
          object.should.be.equal(o);
          value.should.be.equal(o.custom);
          return 'Not valid';
        })
      }}
    ]).should.be.length(1);

  });

  it('Custom', function () {

    validate({
      custom: [1, 2, 3, 4]
    }, [
      {$schema: {
        custom: function (item) {
          return item === 0 ? true : '`custom` should be zero';
        }
      }}
    ]).should.be.length(1);

  });

  it('should work with nested properties', function () {
    validate({
      person: {
        name: 'Andrius'
      }
    }, [
      {$schema: {
        'person.name': String.regexp(/Andrius/)
      }}
    ]).should.be.length(0);

    validate({
      person: {
        name: 'Andrius'
      }
    }, [
      {$schema: {
        'person.name': Number
      }}
    ]).should.be.length(1);
  });

});