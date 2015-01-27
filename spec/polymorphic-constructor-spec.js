var BaseClass              = require('./support/base-class');
var polymorphicConstructor = require('../lib/polymorphic-constructor');

describe('polymorphicConstructor', function() {
  var instance;
  var BasePropClass;
  var OmgClass;

  beforeEach(function() {
    BasePropClass = polymorphicConstructor.call(BaseClass, {
      polymorphicTypes: function() {
        return {
          omg: OmgClass,
          base: BaseClass
        };
      }
    });

    OmgClass = BasePropClass.extend({
      isOmg: true
    });

    instance = new BasePropClass({
      type: 'omg'
    });
  });

  it('should have base values', function() {
    expect(instance.polymorphicKey).toBe('type');
  });

  it('should have base values', function() {
    expect(instance.constructor).toBe(OmgClass);
  });

  it('should still work without type', function() {
    /*eslint no-undefined:0*/
    var localInstance = new BasePropClass();

    expect(localInstance instanceof OmgClass).toBe(false);
    expect(localInstance.constructor).not.toBe(OmgClass);
    expect(localInstance.constructor).toBe(BasePropClass);
    expect(localInstance.isOmg).toBe(undefined);
  });

  it('should still work without type', function() {
    var localInstance = new OmgClass();

    expect(localInstance instanceof BasePropClass).toBe(true);
    expect(localInstance instanceof OmgClass).toBe(true);
    expect(localInstance.constructor).toBe(OmgClass);
    expect(localInstance.isOmg).toBe(true);
  });
});
