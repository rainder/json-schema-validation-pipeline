'use strict';

const chai = require('chai');
const utils = require('../lib/utils');

chai.should();

describe('utils', function () {
  it('should traverse object', function () {

    const object = {
      a: 6,
      b: {
        c: 8,
        d: {
          e: 0
        }
      }
    };

    const paths = [];

    utils.traverseObject(object, (key, value) => {
      paths.push(key);
    });

    paths.should.deep.equals([
      'a',
      'b.c',
      'b.d.e'
    ])
  });

  it('should traverse object and stop', function () {

    class Test {
      constructor() {
        this.a = 8;
      }
    }

    const object = {
      a: 6,
      b: {
        x: new Test(),
        c: 8,
        d: {
          e: 0
        }
      }
    };

    const paths = [];
    const options = {
      stopCondition: (key, value) => value instanceof Test
    };``

    utils.traverseObject(object, (key, value) => {
      paths.push(key);
    }, options);

    paths.should.deep.equals([
      'a',
      'b.x',
      'b.c',
      'b.d.e'
    ])
  });
});