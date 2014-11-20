/**
 * Created by Andrius Skerla on 19/11/14.
 * mailto: andrius@skerla.com
 */
var chai = require('chai');
var ValidationPipeline = require('./..');

chai.should();


describe('base', function () {

  it('should work as expected', function () {

    ValidationPipeline.should.be.a('function');
    ValidationPipeline(null).should.be.a('function');
    //ValidationPipeline([])({});

  });

});