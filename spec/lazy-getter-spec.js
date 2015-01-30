var BaseClass  = require('./support/base-class');
var lazyGetter = require('../extenders/lazy-getter');

describe('assignPropertiesExtender', function() {
  var instance;
  var lazySpy1;
  var lazySpy2;

  beforeEach(function() {
    lazySpy1 = jasmine.createSpy('lazySpy1');
    lazySpy2 = jasmine.createSpy('lazySpy2');

    var BasePropClass = lazyGetter.call(BaseClass, {
      lazy: {
        lazyProp: function() {
          lazySpy1();
          return 1;
        },
        get lazyGet() {
          lazySpy2();
          return 2;
        }
      }
    });

    instance = new BasePropClass();
  });

  it('should return proper values', function() {
    expect(instance.lazyProp).toBe(1);
    expect(instance.lazyGet).toBe(2);
  });

  it('should call proper number of times', function() {
    instance.lazyProp;
    instance.lazyProp;
    instance.lazyProp;
    expect(lazySpy1.calls.count()).toEqual(1);
  });

  it('should call proper number of times', function() {
    instance.lazyGet;
    instance.lazyGet;
    instance.lazyGet;
    expect(lazySpy2.calls.count()).toEqual(1);
  });

  it('should call proper number of times', function() {
    instance.lazyProp;
    instance.lazyProp;
    instance.reset_lazyProp();
    instance.lazyProp;
    instance.lazyProp;
    expect(lazySpy1.calls.count()).toEqual(2);
  });

  it('should call proper number of times', function() {
    instance.lazyGet;
    instance.lazyGet;
    instance.reset_lazyGet();
    instance.lazyGet;
    instance.lazyGet;
    expect(lazySpy2.calls.count()).toEqual(2);
  });

});
