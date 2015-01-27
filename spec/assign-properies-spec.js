var baseClass                = require('./support/base-class');
var assignPropertiesExtender = require('../lib/assign-properties');

describe('assignPropertiesExtender', function() {
  var instance;

  beforeEach(function() {
    var testExtender = assignPropertiesExtender.extend({
      properties: {
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
      }
    });

    var BasePropClass = testExtender.call(baseClass, {});

    instance = new BasePropClass();
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
