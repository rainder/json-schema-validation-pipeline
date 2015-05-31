"use strict";

require('global-validation');
var chai = require('chai');
var $schema = require('./../lib/pipeline-methods/$schema');
var context = require('./../lib/context');
var expect = chai.expect;

const presets = {
  o1: {a: 5, s: 'Hello', b: 9, o: { surname: 'Skerla' }}
};

describe('$schema', function () {

  it('should pass object check ', function () {
    let ctx = context();
    let result = $schema.call(ctx, presets.o1, {
      a: Number.required(),
      s: String.required().min(5).max(5).len(5).regexp(/\S+/),
      b: Number,
      c: Number
    });

    expect(result.success).to.be.ok;
  });

  it('should fail simple object check', function () {
    let ctx = context();
    let result = $schema.call(ctx, presets.o1, {
      z: Number.required().min(5).max(10).between([5, 10]),
      a: String,
      s: Number,
      b: Array,
    });
    
    expect(result.success).not.to.be.ok;
    expect(result.errors.length).to.be.equal(7);
  });

  it('should pass fn check ', function () {
    let ctx = context();
    let result = $schema.call(ctx, presets.o1, {
      o: Object.required().fn(function (value, key) {
        return true;
      })
    });

    expect(result.success).to.be.ok;
  });

  it('should fail fn check ', function () {
    let ctx = context();
    let result = $schema.call(ctx, presets.o1, {
      o: Object.required().fn(function (value, key) {
        return false;
      })
    });

    expect(result.success).not.to.be.ok;
  });

  it('should pass fn advanced check ', function () {
    let ctx = context();
    let o = {
      o: {
        a: 5
      }
    };

    let result = $schema.call(ctx, o, {
      o: Object.required().fn(function (value) {
        this.$schema(value, {
          a: Number
        });
      }),

      'o.a': Number
    });
    
    expect(result.success).to.be.ok;
  });

  it('should fail fn advanced check ', function () {
    let ctx = context();
    let o = {
      o: {
        a: 5
      }
    };

    let result = $schema.call(ctx, o, {
      o: Object.required().fn(function (value) {
        this.$schema(value, {
          a: String
        });
      }),

      'o.a': String
    });

    expect(result.success).not.to.be.ok;
  });

});