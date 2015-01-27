var propsExtender  = require('./assign-properties');
var eventsExtender = require('./events');

function assignDelegateTo(obj, delegate) {
  Object.defineProperty(obj, '_delegate_obj', {
    value: delegate,
    configurable: false,
    writable: false
  });

  obj.listenTo(delegate, obj.trigger);
}

function getterFor(obj, key) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    get: function() {
      return this._delegate_obj.get(key);
    }
  });
}

function setterAndGetterFor(obj, key) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    get: function() {
      return this._delegate_obj.get(key);
    },
    set: function(val) {
      return this._delegate_obj.set(key, val);
    }
  });
}

var delegateExtend = propsExtender.extend(eventsExtender).extend({
  transformConstructor: function(Constructor) {
    return function Class() {
      var ret = Constructor.apply(this, arguments);

      var delegate = this.delegate.apply(this, arguments);

      if (delegate) {
        /*eslint guard-for-in: 0 */
        assignDelegateTo(this, delegate);

        var valApplier = this.delegate_readOnly ? getterFor : setterAndGetterFor;

        for (var key in delegate.constructor._attributes) {
          valApplier(this, key);
        }
      }

      return ret;
    };
  },

  beforeExtend: function(opts) {
    // set default value
    if (!('delegate_readOnly' in opts.protoProps)) {
      opts.protoProps.delegate_readOnly = true;
    }
  },

  afterExtend: function(opts) {
    var get = opts.child.prototype.get;
    var set;

    if (!opts.protoProps.delegate_readOnly) {
      set = opts.child.prototype.set;
    }

    if (get) {
      opts.child.prototype.get = function(key) {
        var delegate = this._delegate_obj;

        if (delegate && key in delegate.constructor._attributes) {
          return delegate.get.apply(delegate, arguments);
        } else {
          get.apply(this, arguments);
        }
      };
    }

    if (set) {
      opts.child.prototype.set = function(key) {
        var delegate = this._delegate_obj;

        if (delegate && key in delegate.constructor._attributes) {
          return delegate.set.apply(delegate, arguments);
        } else {
          set.call(this, arguments);
        }
      };
    }
  }
});

module.exports = delegateExtend;
