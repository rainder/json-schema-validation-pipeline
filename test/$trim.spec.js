"use strict";

var _ = require('lodash');
var chai = require('chai');
var $trim = require('./../lib/pipeline-methods/$trim');
var context = require('./../lib/context');
var expect = chai.expect;

const presets = {
  o1: {a: 5, s: '   Hello asd'}
};

describe('$trim', function () {

  it('should pass object check ', function () {
    let ctx = context();
    let o = _.clone(presets.o1);

    $trim.call(ctx, o, [
      'a', 's', 'b'
    ]);

    expect(o).to.have.keys(['a', 's']);
    expect(o.a).to.be.equals(5);
    expect(o.s).to.be.equals('Hello asd');
  });

});