/**
 * Created by Andrius Skerla on 19/11/14.
 * mailto: andrius@skerla.com
 */
var chai = require('chai');
var expect = chai.expect;
chai.should();

require('./../lib/validation/index');

describe('Single validation', function () {

  it('should pass undefined value as optional', function () {
    var v = String.type();
    expect(v()).to.equal(null);
  });

  it('should check if is defined', function () {
    var v = String.required();
    expect(v()).to.equal('Required')
  });

  it('should fail', function () {
    var v = String.min(2);
    expect(v([1,2,3,4])).to.equal('Expected to be String')

    var v = String.len(6);

    expect(v('123').isValid).not.to.be.ok;

  });

  it('should override error message', function () {
    String.min.message = 'hello';

    var validator = String.min(4);
    expect(validator('112')).to.equal('hello');

    delete String.min.message;
    expect(validator('112')).to.equal('Min length');
  });

  it('should use callback for validation', function () {
    var val = null

    var v = String.min(3).fn(function (value) {
      val = value;
    });

    console.log(v('123'));

    expect(val).to.be.equal('123');
  });

});