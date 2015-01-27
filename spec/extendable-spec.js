var baseClass = require('./support/base-class');
var extender  = require('../index');

describe('extender', function() {
  it('should extend', function() {
    expect(typeof extender.extend).toBe('function');
  });

  it('should return an extender', function() {
    var extender2 = extender.extend();
    expect(typeof extender2).toBe('function');
    expect(typeof extender2.extend).toBe('function');
  });

  it('should not return the same extender', function() {
    var extender2 = extender.extend();
    expect(extender2).not.toBe(extender);
  });


  describe('results', function() {
    var instance;
    beforeEach(function() {
      var BasePropClass = extender.call(baseClass, {});

      var PropClass = BasePropClass.extend({
        get onlyGetter() {
          return 'onlyGetter';
        },

        get getSet() {
          return this._getSet;
        },

        set getSet(val) {
          this._getSet = val;
        },

        standard: 'standard',

        func: function() {
          return this._getSet;
        }
      });

      instance = new PropClass();
    });

    it('should have properties', function() {
      expect(instance.standard).toBe('standard');
      expect(instance.onlyGetter).toBe('onlyGetter');
    });

    it('should work with setter', function() {
      instance.getSet = 'omgfoo';
      expect(instance.getSet).toBe('omgfoo');
      expect(instance.func()).toBe('omgfoo');
    });
  });
});
