/**
 * Created by Andrius Skerla on 19/11/14.
 * mailto: andrius@skerla.com
 */
var chai = require('chai');
var ValidationPipeline = require('./..');
var expect = chai.expect;


describe('$schema', function () {

  it('should pass', function () {
    ValidationPipeline([
      {$schema: {
        a: String
      }}
    ])({ a: '' }).isValid.should.be.ok;
  });

  it('should fail', function () {
    ValidationPipeline([
      {$schema: {
        a: String
      }}
    ])({ a: 3 }).isValid.should.not.be.ok;
    ValidationPipeline([
      {$schema: {
        a: String.min(3)
      }}
    ])({ a: '12' }).isValid.should.not.be.ok;
    ValidationPipeline([
      {$schema: {
        a: String.len(6)
      }}
    ])({ a: '12345' }).isValid.should.not.be.ok;
  });

});