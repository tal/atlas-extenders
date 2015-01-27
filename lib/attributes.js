var _ = require('lodash');

var eventsExtender = require('./events');
var propsExtender  = require('./assign-properties');

function set(key, val, opts) {
  /*jshint validthis:true */

  if (!(key in this.constructor._attributes)) {
    return;
  }

  var firstSet = !(key in this._attributes);
  var current = this.get(key);

  this._attributes[key] = val;

  if (current !== val && !(opts && opts.silent)) {
    var change = {
      key: key,
      firstSet: firstSet,
      previous: current,
      options: opts,
      new: val
    };

    this.trigger('set:' + key, this, change);
    if (!firstSet) {
      this.trigger('update:' + key, this, change);
    }

    this.trigger('set', this, change);
    if (!firstSet) {
      this.trigger('update', this, change);
    }
  }
}

function get(key) {
  /*jshint validthis:true */

  if (key in this._attributes) {
    return this._attributes[key];
  } else {
    return this.constructor._attributes[key];
  }
}

var attrExtend = propsExtender.extend(eventsExtender).extend({
  properties: {
    get: get,
    set: set
  },

  transformConstructor: function(Constructor) {
    return function NewConstructor(options) {
      Object.defineProperty(this, '_attributes', {
        value: {},
        configurable: true
      });

      if (options) {
        for (var key in this.constructor._attributes) {
          if (options.hasOwnProperty(key)) {
            this.set(key, options[key], {
              silent: true
            });
          }
        }
      }

      return Constructor.apply(this, arguments);
    };
  },

  beforeExtend: function(opts) {
    if (!opts.child._attributes) {
      Object.defineProperty(opts.child, '_attributes', {
        value: _.clone(opts.parent._attributes || {})
      });
    }

    var attributes = opts.protoProps.attributes || {};
    // don't actually add them to the prototype of the child class
    delete opts.protoProps.attributes;

    // add the requested attributes to the list.
    _.assign(opts.child._attributes, attributes);

    // Define the helper getter and setter methods for the new attributes
    _.each(attributes, function(_default, key) {
      Object.defineProperty(opts.child.prototype, key, {
        get: function() {
          return this.get(key);
        },
        set: function(val) {
          this.set(key, val);
        },
        enumerable: true
      });
    });
  }
});

module.exports = attrExtend;
