/**
 * Created by Andrius Skerla on 19/11/14.
 * mailto: andrius@skerla.com
 */
var chai = require('chai');
var expect = chai.expect;
var object = require('./../lib/object');

chai.should();


describe('object.js', function () {

  describe('get', function () {

    it('should return values', function () {

      var o = {
        a: {
          b: [
            {c: 8},
            {c: 9}
          ],
          c: {
            d: 7
          }
        }
      };
      expect(object.get(o, 'a')).to.equal(o.a);
      expect(object.get(o, 'a.b')).to.equal(o.a.b);
      expect(object.get(o, 'a.c.d')).to.equal(o.a.c.d);
      expect(object.get(o, 'a.b.1.c')).to.equal(o.a.b[1].c);
      expect(object.get(o, 'a.b.x')).to.equal(undefined);
    });

  });

  describe('del', function () {

    it('should delete values', function () {

      var o = function () {
        return {
          a: {
            b: [
              {c: 8},
              {c: 9}
            ],
            c: {
              d: 7
            }
          }
        };
      };
      expect(object.del(o(), 'a')).not.to.have.property('a');
      expect(object.del(o(), 'a.b').a).to.have.property('c');
      expect(object.del(o(), 'a.c.d').a.c).not.to.have.property('d');

      var x = o();
      object.del(x, 'a.b.1');
      expect(x.a.b).length(1);
      expect(x.a.b[0]).to.have.property('c');
      expect(x.a.b[0].c).equals(8);
    });

  });

  describe('eachDeep', function () {

    var o = {
      a: {
        b: [
          {c: 8},
          {c: 9}
        ],
        c: {
          d: 7
        }
      }
    };

    function test(max, value) {
      var keys = [];
      var keyPaths = [];
      object.eachDeep(o, function (value, key, keyPath) {
        keys.push(key);
        keyPaths.push(keyPath);
      }, max);

      expect(keys).length(value);
    }

    test(0, 8);
    test(1, 1);
    test(2, 3);
    test(3, 6);
    test(4, 8);
  });


});