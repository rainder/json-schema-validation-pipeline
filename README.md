# Advanced JSON Schema Validator

## Installation
```bash
$ npm install json-schema-validation-pipeline
```
## Confession
This package modifies global `String`, `Object`, `Array`, `Function`, `Number` and `Boolean` constructor properties. I feel bad about it. Realy.

## Example

```js
var ValidationPipeline = require('json-schema-validation-pipeline');

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


var validator = new ValidationPipeline([

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

## Available pipeline methods

#### `$schema`
Checks object for property types and values. 
Accepts `Object(propertyPath: SchemaType)`. By default all `SchemaTypes` are optional unless `.required()` is called.

#### `$or`
Checks if one and only one of the properties is defined in the object. 
Accepts `Array(String)`.

#### `$and`
Checks if all or none of the properties are defined in the object.
Accepts `Array(String)`.

#### `$dependency`
Checks if all dependencies are met. 
Accepts `Object(propertyPath: [String])`

## Available SchemaTypes

 * String
   * required
   * min
   * max
   * regexp
   * oneOf
   * fn
   * len
 * Number
   * required
   * min
   * max
   * oneOf
   * fn
 * Boolean
   * required
 * Function
   * required
   * fn
 * Object
   * required
   * fn
 * Array
   * required
   * min
   * max
   * fn
   * len
   * oneOf
   * typeOf
 
## Schema Type Methods

#### `required()`
Specifies that property is required in the JSON object.

#### `min(int)`
Specifies minimal value of `Number` or minimal length of the `String`

#### `max(int)`
Specifies maximal value of `Number` or maximal length of the `String`

#### `len(int)`
Specifies the length of the string

#### `regexp(RegExp)`
Specifies regexp validation pattern for the property

#### `oneOf(array)`
Specifies the possible values for the property

#### `fn(Function(value, key, object))`
Specifies custom validation function. Must return `true` if validation is successfull.

#### `typeOf(SchemaType)`
Specifies the type on the element inside the array. 
```js
var objectToValidate = {
  values: [1, 2, 3, '4'],
};

var validator = new ValidationPipeline([
  {$schema: {
    values: Array.typeOf(Number.min(1))
  }}
]).validate(objectToValidate);

// validator.errors == [ '`value.3` must be a number' ]
```


## Running tests
```bash
$ npm test
```

## License
MIT

