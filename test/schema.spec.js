'use strict';

const chai = require('chai');
const V = require('../');

chai.should();

describe('Schema', function () {
  it('should validate not required', function *() {
    const schema = new V.Schema({
      a: V(String)
    });

    schema.validate({ a: 'one' }).isValid().should.equals(true);
    schema.validate({}).isValid().should.equals(true);
  });

  it('should validate required', function *() {
    const schema = new V.Schema({
      a: V(String).required()
    });

    schema.validate({ a: 'one' }).isValid().should.equals(true);
    schema.validate({}).isValid().should.equals(false);
  });

  describe('String', function () {
    it('should validate type', function () {
      const schema = new V.Schema({
        a: V(String)
      });

      schema.validate({ a: 'one' }).isValid().should.equals(true);
      schema.validate({ a: 'two' }).isValid().should.equals(true);
      schema.validate({ a: 1 }).isValid().should.equals(false);
      schema.validate({ a: {} }).isValid().should.equals(false);
    });

    it('should validate min', function () {
      const schema = new V.Schema({
        a: V(String).min(2)
      });

      schema.validate({ a: 'one' }).isValid().should.equals(true);
      schema.validate({ a: 'tw' }).isValid().should.equals(true);
      schema.validate({ a: '1' }).isValid().should.equals(false);
      schema.validate({ a: '' }).isValid().should.equals(false);
    });

    it('should validate max', function () {
      const schema = new V.Schema({
        a: V(String).max(2)
      });

      schema.validate({ a: 'one' }).isValid().should.equals(false);
      schema.validate({ a: 'tw' }).isValid().should.equals(true);
      schema.validate({ a: '1' }).isValid().should.equals(true);
      schema.validate({ a: '' }).isValid().should.equals(true);
    });

    it('should validate oneOf', function () {
      const schema = new V.Schema({
        a: V(String).oneOf(['one', 'two'])
      });

      schema.validate({ a: 'one' }).isValid().should.equals(true);
      schema.validate({ a: 'two' }).isValid().should.equals(true);
      schema.validate({ a: 'three' }).isValid().should.equals(false);
    });

    it('should validate match', function () {
      const schema = new V.Schema({
        a: V(String).match(/^\d+$/)
      });

      schema.validate({ a: '123' }).isValid().should.equals(true);
      schema.validate({ a: '1a3' }).isValid().should.equals(false);
      schema.validate({ a: 'asd' }).isValid().should.equals(false);
    });
  })
  describe('Number', function () {
    it('should validate number', function () {
      const schema = new V.Schema({
        a: V(Number)
      });

      schema.validate({}).isValid().should.equals(true);
      schema.validate({ a: 5 }).isValid().should.equals(true);
      schema.validate({ a: '' }).isValid().should.equals(false);
    });
    it('should validate min', function () {
      const schema = new V.Schema({
        a: V(Number).min(2)
      });

      schema.validate({ a: 5 }).isValid().should.equals(true);
      schema.validate({ a: 2 }).isValid().should.equals(true);
      schema.validate({ a: 1 }).isValid().should.equals(false);
    });
    it('should validate max', function () {
      const schema = new V.Schema({
        a: V(Number).max(2)
      });

      schema.validate({ a: 1 }).isValid().should.equals(true);
      schema.validate({ a: 2 }).isValid().should.equals(true);
      schema.validate({ a: 5 }).isValid().should.equals(false);
    });
    it('should validate oneOf', function () {
      const schema = new V.Schema({
        a: V(Number).oneOf([1, 2])
      });

      schema.validate({ a: 1 }).isValid().should.equals(true);
      schema.validate({ a: 2 }).isValid().should.equals(true);
      schema.validate({ a: 5 }).isValid().should.equals(false);
    });
  });
  describe('Object', function () {
    it('should validate object', function () {
      const schema = new V.Schema({
        a: V(Object)
      });

      schema.validate({}).isValid().should.equals(true);
      schema.validate({ a: {} }).isValid().should.equals(true);
      schema.validate({ a: '' }).isValid().should.equals(false);
    });
    it('should validate schema', function () {
      const schema = new V.Schema({
        a: V(Object).schema({
          b: V(Number)
        })
      });

      schema.validate({}).isValid().should.equals(true);
      schema.validate({ a: {} }).isValid().should.equals(true);
      schema.validate({ a: { b: 5 } }).isValid().should.equals(true);
      schema.validate({ a: { b: '' } }).isValid().should.equals(false);

      schema.validate({ a: { b: '' } }).getErrors()[0].path.should.equals('a.b');
    });
    it('should validate schema 2', function () {
      const schema = new V.Schema({
        a: V(Object).schema({
          b: V(Object).schema({
            c: V(Number).required()
          })
        })
      });

      schema.validate({}).isValid().should.equals(true);
      schema.validate({ a: {} }).isValid().should.equals(true);
      schema.validate({ a: { b: 5 } }).isValid().should.equals(false);
      schema.validate({ a: { b: '' } }).isValid().should.equals(false);
      schema.validate({ a: { b: {} } }).isValid().should.equals(false);
      schema.validate({ a: { b: { c: '' } } }).getErrors()[0].path.should.equals('a.b.c');
    });
  });

});