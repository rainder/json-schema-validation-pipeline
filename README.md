# Advanced JSON Schema Validator

## Confession
This package modifies global `String`, `Object`, `Array`, `Function`, `Number` and `Boolean` constructor properties. I feel bad about it. Really.

## Installation
```bash
$ npm install json-schema-validation-pipeline
```

## Usage
```js
var ValidationPipeline = require('json-schema-validation-pipeline');

var validate = ValidationPipeline(pipeline);

var result = validate(object);

result.isValid;
result.errors;

```

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


var validate = ValidationPipeline([

  //property value check
  {$schema: {
    'id': Number.required().min(1),
    'name': String.required().min(3),
    'surname': String.required(),
    'age': Number,
    'birthday': String,
    'role': String.oneOf(['Developer', 'Musician']),
    'email': Function.required().fn(function (value) {
      return value === 'andrius@skerla.com'? undefined : 'This email is not mine';
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

var validationResult = validate(objectToValidate);
console.log(validationResult.isValid); // false
console.log(validationResult.errors); // [ '`address.post` depends on `address.city` field.' ]
```

## Advanced Example
```js
var validate = ValidationPipeline({
  o: Object.required().fn(function (object, keyPath) {
    //apply another pipeline for this object!
    return this.$schema(object, {
      a: Array.required().fn(arrayCheck),
      b: Array.required().typeOf(String).fn(arrayCheck)
    });

    function arrayCheck(array, keyPath) {
      //keyPath will be 'o.a' or 'o.b' here

      if (~array.indexOf('Skerla')) {
        this.errors.push('Well, array at path `' + keyPath + '` cannot contain string "Skerla".');
      }
    }
  })
});

var result = validate({
  o: {
    a: [],
    b: ['Skerla']
  }
});

// result.isValid === false
// result.errors === [ 'Well, array at path `o.b` cannot contain string "Skerla".' ]
```

## Interface

`ValidationPipeline(pipeline) : ValidationFunction`

Package exports `Function` which accepts one argument validation pipeline `Array`. Pipeline argument can be `array` or `object`. If `object` is specified it is treated as `$schema` pipeline argument.

```js
ValidationPipeline({
	name: String
});

//equals to

ValidationPipeline([
	{$schema: {
		name: String
	}}
]);

```

`ValidationFunction` accepts one argument which must be target object for validation. Returns `object(errors: [], isValid: Boolean)`.


## Available pipeline methods

#### `$schema`
Checks object for property types and values. 
Accepts `Object(propertyPath: SchemaType)`. By default all `SchemaTypes` are optional unless `.required()` is called.

#### `$strict`
Turns `$schema` validation strict mode on: removes all properties form an object that are not defined in the `$schema`.
Accepts `Boolean` or options `Object(enabled: Boolean, level: Number)`. Level parameter specifies how deep Object should be traversed.
By default `$strict` mode is disabled.

#### Advanced example
```js
var o = {
  l1: {
    l2: {
      a: {},
      b: {},
      c: {}
    },
    k2: {}
  },
  u2: 7
};
ValidationPipeline([
  {$strict: {enabled: true, level: 2}},
  {$schema: {
    l1: Object,
    'l1.l2': Object
  }}
])(o);

//`o.u2` and `o.l1.k2` are removed, but `a`, `b`, `c` in `o.l1.l2` are kept
expect(o).keys('l1');
expect(o.l1).keys('l2');
expect(o.l1.l2).keys(['a', 'b', 'c']);
```

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

var result = ValidationPipeline([
  {$schema: {
    name: String.required();
  }}
])({
  name: 'Andrius',
});

// result.isValid == true
```

#### `min(int)`
Specifies min value of `Number` or min length of the `String` or min length of an `Array`
```js
var result = ValidationPipeline([
  {$schema: {
    bid: Number.min(10)
  }}
])({
  bid: 10,
});

// result.isValid == true
```

#### `max(int)`
Specifies max value of `Number` or max length of the `String` or max length of an `Array`

#### `len(int)`
Specifies the length of the string or array

#### `regexp(RegExp)`
Specifies regexp validation pattern for the property

#### `oneOf(array)`
Specifies possible values for the property
```js
ValidationPipeline([
  {$schema: {
    vegetable: String.oneOf(['tomato', 'salad']),
    fruits: Array.oneOf(['apple', 'orange'])
  }}
])({
  vegetable: 'tomato',
  fruits: ['apple', 'orange'],
});
```

#### `fn(Function(value, key, object))`
Specifies custom validation function. Must not return a value if validation is successful.
```js
var objectToValidate = {
  values: [1, 2, 3],
};

ValidationPipeline([
  {$schema: {
    values: Function.fn(function (value) {
      return value[0] === 1 ? undefined : 'firs element is not 1!';
    })
  }}
])(objectToValidate);
```

#### `typeOf(SchemaType)`
Specifies the type on the element inside the array. 
```js
var objectToValidate = {
  values: [1, 2, 3, '4'],
};

var result = ValidationPipeline([
  {$schema: {
    values: Array.typeOf(Number.min(1))
  }}
])(objectToValidate);

// result.errors == [ '`value.3` must be a number' ]
```


## Running tests
```bash
$ npm test
```

## License
MIT

