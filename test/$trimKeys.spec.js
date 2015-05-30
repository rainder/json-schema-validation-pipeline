"use strict";

require('global-validation');
var _ = require('lodash');
var chai = require('chai');
var $trimKeys = require('./../lib/pipeline-methods/$trimKeys');
var context = require('./../lib/context');
var expect = chai.expect;

const presets = {
  o1: {a: 5, s: 'Hello', b: 9, o: { surname: 'Skerla' }}
};

describe('$trimKeys', function () {

  it('should pass object check ', function () {
    let ctx = context();
    let o = _.clone(presets.o1);

    $trimKeys.call(ctx, o, [
      'a', 's', 'b'
    ]);

    expect(o).to.have.keys(['a', 's', 'b']);
  });

});