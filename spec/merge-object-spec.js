var BaseClass   = require('./support/base-class');
var mergeObject = require('../extenders/merge-object');

describe('mergeObject', function() {
  var Parent;
  var Child;

  beforeEach(function() {
    Parent = mergeObject('obj').call(BaseClass, {
      obj: {
        foo: 'bar',
        omg: 'parent'
      }
    });

    Child = Parent.extend({
      obj: {
        bar: 'baz',
        omg: 'child'
      }
    });
  });

  it('should have original values', function() {
    expect(new Parent().obj).toEqual({
      foo: 'bar',
      omg: 'parent'
    });
  });

  it('should have new values', function() {
    expect(new Child().obj).toEqual({
      foo: 'bar',
      omg: 'child',
      bar: 'baz'
    });
  });
});
