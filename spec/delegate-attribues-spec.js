var BaseClass = require('./support/base-class');
var delegateExtend = require('../lib/delegate-attributes');
var attributesExtend = require('../lib/attributes');

describe('delegateExtend', function() {
  var CoreModel;
  var WrapperModel;
  var coreInstance;
  var instance;

  function shouldDelegateVars() {
    expect(instance.coreStr).toBe('core_str');
    expect(instance.coreInt).toBe(123);
    expect(instance.get('coreInt')).toBe(123);
  }

  describe('basic', function() {
    beforeEach(function() {
      CoreModel = attributesExtend.call(BaseClass, {
        attributes: {
          coreStr: 'core_str',
          coreInt: 123
        }
      });

      WrapperModel = delegateExtend.call(BaseClass, {
        delegate: function() {
          return coreInstance || new CoreModel();
        }
      });

      coreInstance = new CoreModel();
      instance = new WrapperModel();
    });

    it('should delegate vals', shouldDelegateVars);

    it('should change when the core model changes', function() {
      expect(instance.coreInt).toBe(123);
      coreInstance.coreInt = 321;
      expect(instance.coreInt).toBe(321);
    });

    it('should not set', function() {
      expect(instance.coreInt).toBe(123);
      instance.coreInt = 321;
      expect(instance.coreInt).toBe(123);
      expect(coreInstance.coreInt).toBe(123);
    });
  });

  describe('with attributes', function() {
    beforeEach(function() {
      CoreModel = attributesExtend.call(BaseClass, {
        attributes: {
          coreStr: 'core_str',
          coreInt: 123
        }
      });

      WrapperModel = attributesExtend.extend(delegateExtend).call(BaseClass, {
        delegate: function() {
          return coreInstance || new CoreModel();
        },

        attributes: {
          wrapper: 'wrapper'
        }
      });

      coreInstance = new CoreModel();
      instance = new WrapperModel();
    });

    it('should delegate vals', shouldDelegateVars);

    it('should have its own vals', function() {
      expect(instance.wrapper).toBe('wrapper');
      expect(instance.get('wrapper')).toBe('wrapper');
    });

    describe('events', function() {

      it('should bubble up an event', function() {
        var callback = jasmine.createSpy('callback');

        instance.on('set:coreStr', callback);

        coreInstance.coreStr = 'newval';

        expect(callback).toHaveBeenCalledWith(coreInstance, jasmine.objectContaining({
          key: 'coreStr',
          firstSet: true,
          previous: 'core_str',
          new: 'newval'
        }));
      });

    });
  });

});
