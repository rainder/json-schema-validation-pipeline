# Advanced JSON Schema Validator

## Instalation
```bash
$ npm install json-schema-validation-pipeline
```

## Example

```js
var Validation = require('json-schema-validation-pipeline');

var objectToValidate = {
  id: 1,
  name: 'Andrius',
  surname: 'Skerla',
  age: 26,
  email: 'andrius@skerla.com',
  role: 'Developer',
  address: {
    country: 'UK',
    //city: 'London',
    post: 'W12 11X'
  }
};


var validator = new Validation([

  //property value check
  {$schema: {
    'id': Number.required().min(1),
    'name': String.required().min(3),
    'surname': String.required(),
    'age': Number,
    'birthday': String,
    'role': String.oneOf(['Developer', 'Musician']),
    'email': Function.required().fn(function (value) {
      return value === 'andrius@skerla.com'? true : 'This email is not mine';
    }),
    'address': Object,
    'address.country': String,
    'address.city': String,
    'address.post': String.regexp(/^[^\W]+ [^\W]+$/i)
  }},

  //Either age or birthday must be provided
  {$or: ['age', 'birthday']},

  //Either rols or position or hobby must be provided
  {$or: ['role', 'position', 'hobby']},

  //property dependencies
  {$dependency: {
    //if city is defined then country must be defined as well
    'address.city': 'address.country',
    'address.post': ['address.city', 'address.country']
  }}
]);

validator.validate(objectToValidate);
console.log(validator.isValid); //outputs false
console.log(validator.errors); //outputs [ '`address.post` depends on `address.city` field.' ]
```

## Running tests
```bash
$ npm test

## License
MIT
```
