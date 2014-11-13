# Advanced JSON Schema Validator

## Installation
```bash
$ npm install json-schema-validation-pipeline
```
## Confession
This package modifies global `String`, `Object`, `Array`, `Function`, `Number` and `Boolean` constructor properties. I feel bad about it. Really.

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
Checks if one and only one property is defined in the object. 
Accepts `Array(String)`.

#### `$and`
Checks if all or none of the properties are defined in the object.
Accepts `Array(String)`.

#### `$dependency`
Checks if all dependencies are met. 
Accepts `Object(propertyPath: [String])`

## Available SchemaTypes

#### `String`
Applicable methods:
 * required
 * len
 * min
 * max
 * regexp
 * oneOf
 * fn
 
#### `Number`
Applicable methods:
 * required
 * min
 * max
 * oneOf
 * fn

#### `Boolean`
Applicable methods:
 * required
 * fn

#### `Function`
Applicable methods:
 * required
 * fn

#### `Object`
Applicable methods:
 * required
 * fn
 
#### `Array`
Applicable methods:
 * required
 * len
 * min
 * max
 * oneOf
 * typeOf
 * fn
 
## SchemaType Methods

#### `required()`
Specifies that property is required in the JSON object
```js
var objectToValidate = {
  name: 'Andrius',
};

var validator = new ValidationPipeline([
  {$schema: {
    name: String.required();
  }}
]).validate(objectToValidate);

// validator.isValid == true
```

#### `min(int)`
Specifies min value of `Number` or min length of the `String` or min length of an `Array`
```js
var objectToValidate = {
  bid: 10,
};

var validator = new ValidationPipeline([
  {$schema: {
    bid: Number.min(10)
  }}
]).validate(objectToValidate);

// validator.isValid == true
```

#### `max(int)`
Specifies max value of `Number` or max length of the `String` or max length of an `Array`

#### `len(int)`
Specifies the length of the string or array

#### `regexp(RegExp)`
Specifies regexp validation pattern for the property

#### `oneOf(array)`
Specifies the possible values for the property
```js
var objectToValidate = {
  vegetable: 'tomato',
  fruits: ['apple', 'orange'],
};

var validator = new ValidationPipeline([
  {$schema: {
    vegetable: String.oneOf(['tomato', 'salad']),
    fruits: Array.oneOf(['apple', 'orange'])
  }}
]).validate(objectToValidate);
```

#### `fn(Function(value, key, object))`
Specifies custom validation function. Must return `true` if validation is successful.
```js
var objectToValidate = {
  values: [1, 2, 3],
};

var validator = new ValidationPipeline([
  {$schema: {
    values: Function.fn(function (value) {
      return value[0] === 1 ? true : 'firs element is not 1!';
    })
  }}
]).validate(objectToValidate);
```

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

