var assignProperties = require('../../lib/utils/assign-properties');

describe('assignProperties', function() {
  it('should assign basically', function() {
    var test = {};


    var basicProperty = {
      standard: 'basicStandard',
      standard2: 'standard2'
    };

    assignProperties(test, basicProperty);

    expect(test.standard2).toBe(basicProperty.standard2);
  });


  describe('advanced properties', function() {
    var getterSpy, setterSpy;
    var advancedProperty;
    var test;

    beforeEach(function() {
      getterSpy = jasmine.createSpy('getterCalled');
      setterSpy = jasmine.createSpy('setterCalled');

      advancedProperty = {
        get thisIsaGetter() {
          getterSpy();
          return 'thisIsaGetter';
        },

        set thisIsaGetter(val) {
          setterSpy(val);
          this._setter = val;
        },

        standard: 'thisIsStandard'
      };

      test = {};

      assignProperties(test, advancedProperty);
    });

    it('should work with getters', function() {
      expect(test.thisIsaGetter).toBe('thisIsaGetter');
      expect(getterSpy).toHaveBeenCalled();
    });

    it('should not call getter', function() {
      expect(getterSpy).not.toHaveBeenCalled();
    });

    it('should not call setter', function() {
      expect(setterSpy).not.toHaveBeenCalled();
    });

    it('should work with setters', function() {
      test.thisIsaGetter = 'omgtest';
      expect(setterSpy.calls.mostRecent().args[0]).toBe('omgtest');
      expect(test._setter).toBe('omgtest');
    });
  });
});
