"use strict";

var _ = require('lodash');
var chai = require('chai');
var $dependency = require('./../lib/pipeline-methods/$dependency');
var context = require('./../lib/context');
var expect = chai.expect;

describe('$dependency', function () {

  it('should pass object check ', function () {
    let result;
    let ctx = context();
    let o = {
      a: 5,
      b: 7,
      c: 9
    };

    result = $dependency.call(ctx, o, {
      'a': 'b'
    });
    expect(result.isValid).to.be.equal(true);

    result = $dependency.call(ctx, o, {
      'a': ['b', 'c']
    });
    expect(result.isValid).to.be.equal(true);

    result = $dependency.call(ctx, o, {
      'd': ['b', 'e']
    });
    expect(result.isValid).to.be.equal(true);
  });

  it('should fail object check ', function () {
    let result;
    let ctx = context();
    let o = {
      a: 5,
      b: 7
    };

    result = $dependency.call(ctx, o, {
      a: 'c'
    });
    expect(result.isValid).to.be.equal(false);
  });

});