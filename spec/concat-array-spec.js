var BaseClass   = require('./support/base-class');
var concatArray = require('../lib/concat-array');

describe('concatArray', function() {
  var Parent;
  var Child;

  beforeEach(function() {
    Parent = concatArray('arr').call(BaseClass, {
      arr: [1, 2]
    });

    Child = Parent.extend({
      arr: ['three', 'four']
    });
  });

  it('should have original values', function() {
    expect(new Parent().arr).toEqual([1, 2]);
  });

  it('should have new values', function() {
    expect(new Child().arr).toEqual([1, 2, 'three', 'four']);
  });
});
