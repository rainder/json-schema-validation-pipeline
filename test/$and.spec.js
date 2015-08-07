"use strict";

var _ = require('lodash');
var chai = require('chai');
var $and = require('./../lib/pipeline-methods/$and');
var context = require('./../lib/context');
var expect = chai.expect;

describe('$and', function () {

  it('should pass object check ', function () {
    let result;
    let ctx = context();
    let o = {
      a: 5,
      b: 7
    };

    result = $and.call(ctx, o, [
      'a', 'b'
    ]);
    expect(result.isValid).to.be.equal(true);
  });

  it('should fail object check ', function () {
    let result;
    let ctx = context();
    let o = {
      a: 5,
      b: 7
    };

    result = $and.call(ctx, o, [
      'd', 'a'
    ]);

    expect(result.isValid).to.be.equal(false);
  });

});