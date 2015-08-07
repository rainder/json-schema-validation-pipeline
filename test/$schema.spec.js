"use strict";

var chai = require('chai');
var $schema = require('./../lib/pipeline-methods/$schema');
var context = require('./../lib/context');
var V = require('./../lib/validation');
var expect = chai.expect;

const presets = {
  o1: {a: 5, s: 'Hello', b: 9, o: { surname: 'Skerla' }}
};

describe('$schema', function () {

  it('should pass object check ', function () {
    let ctx = context();
    let result = $schema.call(ctx, presets.o1, {
      a: V(Number).required(),
      s: V(String).required().min(5).max(5).len(5).regexp(/\S+/),
      b: V(Number),
      c: V(Number)
    });

    expect(result.isValid).to.be.ok;
  });

  it('should fail simple object check', function () {
    let ctx = context();
    let result = $schema.call(ctx, presets.o1, {
      z: V(Number).required().min(5).max(10).between([5, 10]),
      a: V(String),
      s: V(Number),
      b: V(Array),
    });

    expect(result.isValid).not.to.be.ok;
    expect(Object.keys(result.errors).length).to.be.equal(4);
  });

  it('should pass fn check ', function () {
    let ctx = context();
    let result = $schema.call(ctx, presets.o1, {
      o: V(Object).required().fn(function (value, key) {
        return true;
      })
    });

    expect(result.isValid).to.be.ok;
  });

  it('should fail fn check ', function () {
    let ctx = context();
    let result = $schema.call(ctx, presets.o1, {
      o: V(Object).required().fn(function (value, key) {
        return false;
      })
    });

    expect(result.isValid).not.to.be.ok;
  });

  it('should pass fn advanced check ', function () {
    let ctx = context();
    let o = {
      o: {
        a: 5
      }
    };

    let result = $schema.call(ctx, o, {
      o: V(Object).required().fn(function (value) {
        this.$schema(value, {
          a: V(Number)
        });
      }),

      'o.a': V(Number)
    });
    
    expect(result.isValid).to.be.ok;
  });

  it('should fail fn advanced check ', function () {
    let ctx = context();
    let o = {
      o: {
        a: 5
      }
    };

    let result = $schema.call(ctx, o, {
      o: V(Object).required().fn(function (value) {
        this.$schema(value, {
          a: V(String)
        });
      }),

      'o.a': V(String)
    });

    expect(result.isValid).not.to.be.ok;
  });

  it('should not create an error', function () {
    let ctx = context();
    let o = {};

    let result = $schema.call(ctx, o, {
      a: V(String).regexp(/\d+/)
    });

    expect(result.isValid).to.be.ok;
  });

  it('should not create an error', function () {
    let ctx = context();
    let o = {};

    let result = $schema.call(ctx, o, {
      a: V(Object).fn(function () {
        console.log(arguments);
      })
    });

    expect(result.isValid).to.be.ok;
  });

});