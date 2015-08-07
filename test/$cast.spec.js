"use strict";

var _ = require('lodash');
var chai = require('chai');
var $cast = require('./../lib/pipeline-methods/$cast');
var context = require('./../lib/context');
var expect = chai.expect;

describe('$cast', function () {

  it('should cast number to string', function () {
    let result;
    let ctx = context();
    let o = {
      a: 5,
      b: 7
    };

    result = $cast.call(ctx, o, {
      'a': String
    });

    expect(result.isValid).to.be.equal(true);
    expect(o.a).to.be.a('String');
  });

  it('should fail to cast object to string', function () {
    let result;
    let ctx = context();
    let o = {
      a: {},
      b: 7
    };

    result = $cast.call(ctx, o, {
      'a': String
    });

    expect(result.isValid).to.be.equal(false);
    expect(o.a).to.be.an('Object');
  });

  it('should cast string to number', function () {
    let result;
    let ctx = context();
    let o = {
      b: {
        c: '7'
      }
    };

    result = $cast.call(ctx, o, {
      'b.c': Number
    });

    expect(result.isValid).to.be.equal(true);
    expect(o.b.c).to.be.a('Number');
  });

  it('should all succeed', function () {
    let ctx = context();

    expect($cast.call(ctx, { a: '5' }, {
      'a': String
    }).isValid).to.be.equal(true);

    expect($cast.call(ctx, { a: 5 }, {
      'a': Number
    }).isValid).to.be.equal(true);

  });

  it('should all fail', function () {
    let ctx = context();

    expect($cast.call(ctx, { a: 5 }, {
      'a': Array
    }).isValid).to.be.equal(false);

    expect($cast.call(ctx, { a: {} }, {
      'a': Number
    }).isValid).to.be.equal(false);
  });

});