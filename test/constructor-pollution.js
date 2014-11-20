/**
 * Created by Andrius Skerla on 19/11/14.
 * mailto: andrius@skerla.com
 */
var chai = require('chai');
var expect = chai.expect;
chai.should();

require('./../lib/validation/index');

describe('Constructor pollution', function () {

  it('should pollute constructors', function () {

    expect(String).to.be.a('function');
    expect(String.min(1)).to.be.a('function');
    expect(String.min(1).max(2)).to.be.a('function');
    expect(String.min(1).max(2).len(0)).to.be.a('function');

    expect(String).to.have.property('min');
    expect(String).to.have.property('max');
    expect(String).to.have.property('len');

    expect(String.min(0)).to.have.property('min');
    expect(String.min(0)).to.have.property('len');
    expect(String.min(0)).to.have.property('max');

    expect(String.min(0).max(1)).to.have.property('min');
    expect(String.min(0).max(1).len(2)).to.have.property('max');
  });

});