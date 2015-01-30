var _ = require('lodash');

var extender      = require('../index');
var objectToPlist = require('./utils/object-to-property-list');

var lazyGetterExtender = extender.extend({
  beforeExtend: function(opts) {
    if (!opts.protoProps.lazy) {
      return;
    }

    var lazyProps = opts.protoProps.lazy;
    delete opts.protoProps.lazy;

    var props = {};

    _.each(objectToPlist(lazyProps), function(propDef, propName) {
      function lazy() {
        var func;

        if (propDef.get) {
          func = propDef.get;
        } else {
          func = propDef.value;
        }

        this._lazy_cache || (this._lazy_cache = {});

        if (!(propName in this._lazy_cache)) {
          this._lazy_cache[propName] = func.call(this);
        }

        return this._lazy_cache[propName];
      }

      function reset() {
        this._lazy_cache || (this._lazy_cache = {});

        delete this._lazy_cache[propName];
      }

      props[propName] = {
        get: lazy,
        enumerable: true
      };

      props['reset_'+propName] = {
        value: reset,
        enumerable: true
      };
    });

    Object.defineProperties(opts.child.prototype, props);
  }
});

module.exports = lazyGetterExtender;
