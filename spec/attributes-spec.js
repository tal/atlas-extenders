var BaseClass  = require('./support/base-class');
var attributes = require('../lib/attributes');

describe('attributes', function() {
  var instance;
  var childInstance;
  var AttributedClass;
  var AttributedSubClass;

  beforeAll(function() {

    AttributedClass = attributes.call(BaseClass, {
      attributes: {
        override: 'parent',
        parent: '123'
      }
    });

    AttributedSubClass = AttributedClass.extend({
      attributes: {
        override: 'sub',
        child: 321
      }
    });
  });

  it('s defaults should be set', function() {
    expect(AttributedClass._attributes).toEqual({
      override: 'parent',
      parent: '123'
    });
  });

  it('s child\'s defaults should be set', function() {
    expect(AttributedSubClass._attributes).toEqual({
      child: 321,
      override: 'sub',
      parent: '123'
    });
  });

  describe('defaults', function() {
    beforeEach(function() {
      instance = new AttributedClass();
      childInstance = new AttributedSubClass();
    });

    it('override properly', function() {
      expect(instance.get('override')).toBe('parent');
      expect(childInstance.get('override')).toBe('sub');

      expect(instance.parent).toBe('123');
      expect(childInstance.parent).toBe('123');

      expect(instance.child).toBeUndefined();
      expect(childInstance.child).toBe(321);
    });

    it('should handle random keys', function() {
      expect(instance.get('asdfasdfasdf')).toBeUndefined();
    });
  });

  describe('defining via constructor', function() {
    beforeEach(function() {
      instance = new AttributedClass({
        somethingElse: true,
        override: 'overridenParent',
        parent: '_1234'
      });
      childInstance = new AttributedSubClass({
        override: 'overridenChild',
        child: 3214
      });
    });

    it('should set the variables', function() {
      expect(instance.somethingElse).toBeUndefined();
      expect(childInstance.somethingElse).toBeUndefined();
    });

    it('should set the variables', function() {
      expect(instance.override).toBe('overridenParent');
      expect(childInstance.override).toBe('overridenChild');
    });

  });

  describe('sending events', function() {

    it('should only send set', function() {
      var callback = jasmine.createSpy('callback');
      var callback2 = jasmine.createSpy('callback2');
      instance = new AttributedClass();

      instance.on('set:parent', callback);
      instance.on('update:parent', callback2);

      instance.parent = 'yo';

      expect(callback).toHaveBeenCalledWith(instance, jasmine.objectContaining({
        key: 'parent',
        new: 'yo',
        firstSet: true
      }));

      expect(callback2).not.toHaveBeenCalled();

    });

    it('should send both', function() {
      var callback = jasmine.createSpy('callback');
      var callback2 = jasmine.createSpy('callback2');
      instance = new AttributedClass({
        parent: 'omgset',
      });

      instance.on('set:parent', callback);
      instance.on('update:parent', callback2);

      instance.parent = 'yo';

      expect(callback).toHaveBeenCalledWith(instance, jasmine.objectContaining({
        key: 'parent',
        new: 'yo',
        previous: 'omgset',
        firstSet: false
      }));

      expect(callback2).toHaveBeenCalledWith(instance, jasmine.objectContaining({
        key: 'parent',
        new: 'yo',
        previous: 'omgset',
        firstSet: false
      }));

    });

    it('shouldn\'t send whith silent send both', function() {
      var callback = jasmine.createSpy('callback');
      var callback2 = jasmine.createSpy('callback2');
      instance = new AttributedClass({
        parent: 'omgset',
      });

      instance.on('set:parent', callback);
      instance.on('update:parent', callback2);

      instance.set('parent', 'yo', {
        silent: true
      });

      expect(callback).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();

    });

  });

});
