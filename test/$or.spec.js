"use strict";

require('global-validation');
var _ = require('lodash');
var chai = require('chai');
var $or = require('./../lib/pipeline-methods/$or');
var context = require('./../lib/context');
var expect = chai.expect;

describe('$or', function () {

  it('should pass object check ', function () {
    let result;
    let ctx = context();
    let o = {
      a: 5,
      b: 7
    };

    result = $or.call(ctx, o, [
      'a', 'c'
    ]);

    expect(result.success).to.be.equal(true);

    result = $or.call(ctx, o, [
      'b', 'c'
    ]);

    expect(result.success).to.be.equal(true);
  });

  it('should fail object check ', function () {
    let result;
    let ctx = context();
    let o = {
      a: 5,
      b: 7
    };

    result = $or.call(ctx, o, [
      'd', 'c'
    ]);

    expect(result.success).to.be.equal(false);
  });

});