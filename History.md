# 0.3.0 / 2015-05-31

* redesign
* removed $strict
* added $trimKeys

# 0.2.2 / 2014-11-15

* added level support for `$strict` method

# 0.2.1 / 2014-11-14

* added support for key paths in nested `Function` calls
* Breaking changes:
	* Function callbacks must NOT return truthy values upon successful validation

# 0.2.0 / 2014-11-14

* changed module interface

# 0.1.6 / 2014-11-14

* added deep object watch support for `$strict` pipeline method

# 0.1.4 / 2014-11-14

* added support for `$strict` pipeline method

# 0.1.3 / 2014-11-14

* if no pipeline method is defined Validator uses `$schema`

# 0.1.0 / 2014-11-13

* added support for `String.length()`
* `SchemaType` functions are now executed in `ValidationPipeline` context
* `SchemaType` functions now gets third argument which is object being validated
* Added support for `Array`
