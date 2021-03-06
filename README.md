# Advanced JSON Schema Validator

Makes your life easier!

## Installation
```bash
$ npm install json-schema-validation-pipeline
```

## Usage
```js
var ValidationPipeline = require('json-schema-validation-pipeline');
var V = ValidationPipeline.V;

var validate = ValidationPipeline(pipeline);


var result = validate(object);

result.isValid;
result.errors;

```

## Example

```js
var ValidationPipeline = require('json-schema-validation-pipeline');
var V = ValidationPipeline.V;

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
    'id': V(Number).required().min(1),
    'name': V(String).required().min(3),
    'surname': V(String).required(),
    'age': V(Number),
    'birthday': V(String),
    'role': V(String).oneOf(['Developer', 'Musician']),
    'email': V(Function).required().fn(function (value) {
      return value === 'andrius@skerla.com'? undefined : 'This email is not mine';
    }),
    'address': V(Object),
    'address.country': V(String),
    'address.city': V(String),
    'address.post': V(String).regexp(/^[^\W]+ [^\W]+$/i)
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
console.log(validationResult.errors);
```

## Advanced Example
```js
var validate = ValidationPipeline([
  {$schema: {
    o: V(Object).required().fn(function (object, keyPath) {
      //apply another pipeline for this object!
      return this.$schema(object, {
        a: V(Array).required().fn(arrayCheck),
        b: V(Array).required().typeOf(String).fn(arrayCheck)
      });

      function arrayCheck(array, keyPath) {
        //keyPath will be 'o.a' or 'o.b' here

        if (~array.indexOf('Skerla')) {
          this.errors['error'] = 'Well, array at path `' + keyPath + '` cannot contain string "Skerla".';
        }
      }
    })
  }}
]);

var result = validate({
  o: {
    a: [],
    b: ['Skerla']
  }
});

// result.isValid === false
// result.errors['o.b'] = 'Well, array at path `o.b` cannot contain string "Skerla".';
```

## Interface

`ValidationPipeline(pipeline) : ValidationFunction`

Package exports `Function` which accepts one argument validation pipeline `Array`. Pipeline argument can be `array` or `object`. If `object` is specified it is treated as `$schema` pipeline argument.

```js
ValidationPipeline({
	name: V(String)
});

//equals to

ValidationPipeline([
	{$schema: {
		name: V(String)
	}}
]);

```

`ValidationFunction` accepts one argument which must be target object for validation. Returns `object(errors: {}, isValid: Boolean)`.


## Available pipeline methods

#### `$schema`
Checks object for property types and values. 
Accepts `Object(propertyPath: SchemaType)`. By default all `SchemaTypes` are optional unless `.required()` is called.

#### `$take`
Array key intersection. Removes keys from the object which are missing in the array.

```{$take: ['first_name', 'last_name']}```

#### `$trim`
Invokes `.trim()` on every specified property

```{$trim: ['name.first', 'last_name']}```

#### `$or`
Checks if one and only one property is defined in the object. 
Accepts `Array(String)`.

#### `$and`
Checks if all or none of the properties are defined in the object.
Accepts `Array(String)`.

#### `$dependency`
Checks if all dependencies are met. 
Accepts `Object(propertyPath: [String])`

#### `$cast`
Casts number to string or string to number.
```{$cast: { age: Number }}```

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
    name: V(String).required();
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
    bid: V(Number).min(10)
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
    vegetable: V(String).oneOf(['tomato', 'salad']),
    fruits: V(Array).oneOf(['apple', 'orange'])
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
    values: V(Function).fn(function (value) {
      this.errors['a'] = 'firs element is not 1!';
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
    values: V(Array).typeOf(Number.min(1))
  }}
])(objectToValidate);

// result.errors['value.3'] = 'must be a number';
```


## Running tests
```bash
$ npm test
```

## License
MIT

