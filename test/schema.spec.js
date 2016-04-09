'use strict';

const chai = require('chai');
const V = require('../');

chai.should();

describe('Schema', function () {
  it('should validate not required', function () {
    const schema = new V.Schema({
      a: V(String)
    });

    schema.validate({ a: 'one' }).isValid().should.equals(true);
    schema.validate({}).isValid().should.equals(true);
  });

  it('should validate required', function () {
    const schema = new V.Schema({
      a: V(String).required()
    });

    schema.validate({ a: 'one' }).isValid().should.equals(true);
    schema.validate({}).isValid().should.equals(false);
  });

  it('should validate null', function () {
    const schema = new V.Schema({
      a: V(Object).null().required()
    });

    schema.validate({ a: null }).isValid().should.equals(true);
    schema.validate({ a: {} }).isValid().should.equals(true);
    schema.validate({ a: 'string' }).isValid().should.equals(false);
    schema.validate({}).isValid().should.equals(false);

    schema.validate({ a: 'string' }).getErrors()[0].message.should.match(/or Null/);
  });

  describe('String', function () {
    it('should validate type', function () {
      const schema = new V.Schema({
        a: V(String)
      });

      schema.validate({ a: 'one' }).isValid().should.equals(true);
      schema.validate({ a: 'two' }).isValid().should.equals(true);
      schema.validate({ a: 1 }).isValid().should.equals(false);
      schema.validate({ a: {} }).isValid().should.equals(false);
    });

    it('should validate min', function () {
      const schema = new V.Schema({
        a: V(String).min(2)
      });

      schema.validate({ a: 'one' }).isValid().should.equals(true);
      schema.validate({ a: 'tw' }).isValid().should.equals(true);
      schema.validate({ a: '1' }).isValid().should.equals(false);
      schema.validate({ a: '' }).isValid().should.equals(false);
    });

    it('should validate max', function () {
      const schema = new V.Schema({
        a: V(String).max(2)
      });

      schema.validate({ a: 'one' }).isValid().should.equals(false);
      schema.validate({ a: 'tw' }).isValid().should.equals(true);
      schema.validate({ a: '1' }).isValid().should.equals(true);
      schema.validate({ a: '' }).isValid().should.equals(true);
    });

    it('should validate oneOf', function () {
      const schema = new V.Schema({
        a: V(String).oneOf(['one', 'two'])
      });

      schema.validate({ a: 'one' }).isValid().should.equals(true);
      schema.validate({ a: 'two' }).isValid().should.equals(true);
      schema.validate({ a: 'three' }).isValid().should.equals(false);
    });

    it('should validate match', function () {
      const schema = new V.Schema({
        a: V(String).match(/^\d+$/)
      });

      schema.validate({ a: '123' }).isValid().should.equals(true);
      schema.validate({ a: '1a3' }).isValid().should.equals(false);
      schema.validate({ a: 'asd' }).isValid().should.equals(false);
    });

    it('should validate len', function () {
      const schema = new V.Schema({
        a: V(String).len(5)
      });

      schema.validate({ a: '12345' }).isValid().should.equals(true);
      schema.validate({ a: '1234' }).isValid().should.equals(false);
      schema.validate({ a: '123456' }).isValid().should.equals(false);
    });
  })
  describe('Number', function () {
    it('should validate number', function () {
      const schema = new V.Schema({
        a: V(Number)
      });

      schema.validate({}).isValid().should.equals(true);
      schema.validate({ a: 5 }).isValid().should.equals(true);
      schema.validate({ a: '' }).isValid().should.equals(false);
    });
    it('should validate min', function () {
      const schema = new V.Schema({
        a: V(Number).min(2)
      });

      schema.validate({ a: 5 }).isValid().should.equals(true);
      schema.validate({ a: 2 }).isValid().should.equals(true);
      schema.validate({ a: 1 }).isValid().should.equals(false);
    });
    it('should validate max', function () {
      const schema = new V.Schema({
        a: V(Number).max(2)
      });

      schema.validate({ a: 1 }).isValid().should.equals(true);
      schema.validate({ a: 2 }).isValid().should.equals(true);
      schema.validate({ a: 5 }).isValid().should.equals(false);
    });
    it('should validate oneOf', function () {
      const schema = new V.Schema({
        a: V(Number).oneOf([1, 2])
      });

      schema.validate({ a: 1 }).isValid().should.equals(true);
      schema.validate({ a: 2 }).isValid().should.equals(true);
      schema.validate({ a: 5 }).isValid().should.equals(false);
    });
  });
  describe('Object', function () {
    it('should validate object', function () {
      const schema = new V.Schema({
        a: V(Object)
      });

      schema.validate({}).isValid().should.equals(true);
      schema.validate({ a: {} }).isValid().should.equals(true);
      schema.validate({ a: '' }).isValid().should.equals(false);
    });
    it('should validate schema', function () {
      const schema = new V.Schema({
        a: V(Object).schema({
          b: V(Number)
        })
      });

      schema.validate({}).isValid().should.equals(true);
      schema.validate({ a: {} }).isValid().should.equals(true);
      schema.validate({ a: { b: 5 } }).isValid().should.equals(true);
      schema.validate({ a: { b: '' } }).isValid().should.equals(false);

      schema.validate({ a: { b: '' } }).getErrors()[0].path.should.equals('a.b');
    });
    it('should validate schema 2', function () {
      const schema = new V.Schema({
        a: V(Object).schema({
          b: V(Object).schema({
            c: V(Number).required()
          })
        })
      });

      schema.validate({}).isValid().should.equals(true);
      schema.validate({ a: {} }).isValid().should.equals(true);
      schema.validate({ a: { b: 5 } }).isValid().should.equals(false);
      schema.validate({ a: { b: '' } }).isValid().should.equals(false);
      schema.validate({ a: { b: {} } }).isValid().should.equals(false);
      schema.validate({ a: { b: { c: '' } } }).getErrors()[0].path.should.equals('a.b.c');
    });
  });
  describe('Array', function () {
    it('should validate an array', function () {
      const schema = new V.Schema({
        a: V(Array)
      });

      schema.validate({}).isValid().should.equals(true);
      schema.validate({ a: [] }).isValid().should.equals(true);
      schema.validate({ a: {} }).isValid().should.equals(false);
    });
    it('should validate min', function () {
      const schema = new V.Schema({
        a: V(Array).min(1)
      });

      schema.validate({ a: [1] }).isValid().should.equals(true);
      schema.validate({ a: [1, 2] }).isValid().should.equals(true);
      schema.validate({ a: [] }).isValid().should.equals(false);
    });
    it('should validate max', function () {
      const schema = new V.Schema({
        a: V(Array).max(2)
      });

      schema.validate({ a: [] }).isValid().should.equals(true);
      schema.validate({ a: [1] }).isValid().should.equals(true);
      schema.validate({ a: [1, 2] }).isValid().should.equals(true);
      schema.validate({ a: [1, 2, 3] }).isValid().should.equals(false);
    });
    it('should validate oneOf', function () {
      const schema = new V.Schema({
        a: V(Array).oneOf([1, 2])
      });

      schema.validate({ a: [] }).isValid().should.equals(true);
      schema.validate({ a: [1] }).isValid().should.equals(true);
      schema.validate({ a: [1, 2] }).isValid().should.equals(true);
      schema.validate({ a: [1, 2, 3] }).isValid().should.equals(false);
      schema.validate({ a: [3] }).isValid().should.equals(false);
    });
    it('should validate typeOf', function () {
      const schema = new V.Schema({
        a: V(Array).typeOf(String)
      });

      schema.validate({ a: [] }).isValid().should.equals(true);
      schema.validate({ a: ['a'] }).isValid().should.equals(true);
      schema.validate({ a: ['a', 'b'] }).isValid().should.equals(true);
      schema.validate({ a: ['a', 'b', 4] }).isValid().should.equals(false);
    });
    it('should validate schema', function () {
      const schema = new V.Schema({
        a: V(Array).schema({
          b: V(String).required()
        })
      });

      schema.validate({ a: [] }).isValid().should.equals(true);
      schema.validate({ a: [{ b: 'asd' }] }).isValid().should.equals(true);
      schema.validate({ a: [{}] }).isValid().should.equals(false);
      schema.validate({ a: [{ b: '123' }, { b: '234' }] }).isValid().should.equals(true);
      schema.validate({ a: [{ b: '123' }, { b: '234' }, {}] }).isValid().should.equals(false);
    });
  });


  describe('strict', function () {
    it('should remove unwanted keys', function () {
      const schema = new V.Schema({
        a: V(String)
      }, { strict: true });

      schema.validate({
        a: 'asd',
        b: '23'
      }).getClean().should.deep.equals({
        a: 'asd'
      });
    });

    it('should remove unwanted child keys', function () {
      const schema = new V.Schema({
        o: {
          a: V(String)
        }
      }, { strict: true });

      schema.validate({
        o: {
          a: 'asd',
          b: '23'
        }
      }).getClean().should.deep.equals({
        o: {
          a: 'asd'
        }
      });
    });

    it('should remove unwanted childx2 keys', function () {
      const schema = new V.Schema({
        o: {
          o: {
            a: V(String)
          }
        }
      }, { strict: true });

      schema.validate({
        o: {
          o: {
            a: 'asd',
            b: '23'
          }
        }
      }).getClean().should.deep.equals({
        o: {
          o: {
            a: 'asd'
          }
        }
      });
    });

    it('should remove unwanted childx2 keys in sub-schema definitions', function () {
      const schema = new V.Schema({
        o: V(Object).schema({
          a: V(String)
        })
      }, { strict: true });

      schema.validate({
        o: {
          a: 'asd',
          b: '23'
        }
      }).getClean().should.deep.equals({
        o: { a: 'asd' }
      });
    });

    it('should remove unwanted childx2 keys in sub-schemax2 definitions', function () {
      const schema = new V.Schema({
        o: V(Object).schema({
          o: {
            o: V(Object).schema({
              o: {
                a: V(String)
              }
            })
          }
        })
      }, { strict: true });

      schema.validate({
        o: {
          o: {
            o: {
              o: {
                a: 'asd',
                b: '23'
              }
            }
          }
        }
      }).getClean().should.deep.equals({
        o: {
          o: {
            o: {
              o: {
                a: 'asd'
              }
            }
          }
        }
      });
    });

  })

});