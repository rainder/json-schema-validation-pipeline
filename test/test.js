/**
 * Created by Andrius Skerla on 19/11/14.
 * mailto: andrius@skerla.com
 */
var chai = require('chai');
var ValidationPipeline = require('./../lib/json-schema-validation-pipeline.js');

chai.should();


describe('base', function () {

  it('should work as expected', function () {

    var validate = ValidationPipeline([
      {$trimKeys: ['first_name', 'last_name', 'age', 'city', 'address']},
      {$schema: {
        first_name: String.required(),
        last_name: String.required(),
        age: Number
      }},
      {$dependency: {
        age: 'birthday'
      }},
      {$or: ['address.city', 'city']},
      {$and: ['first_name', 'last_name']}
    ]);

    var r = validate({
      first_name: 'Andrius',
      last_name: 'Skerla',
      age: 25,
      address: {
        city: 9
      }
    });

    console.log(r);

  });

});