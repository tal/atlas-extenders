var _ = require('lodash');

var assignProperties = require('./lib/utils/assign-properties');

function identity(foo) {
  return foo;
}

function extender(opts) {
    opts || (opts = {});
    var extend;

    extend = function extend(protoProps, staticProps) {
        var parent = this;

        var mixinsInAndSelf = extend._mixedInExtenders.concat([extend]);

        mixinsInAndSelf = _.uniq(mixinsInAndSelf);

        var builderOpts = {
            mixinsInAndSelf: mixinsInAndSelf,
            protoProps: protoProps,
            staticProps: staticProps
        };

        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call the parent's constructor.
        var child;
        if (protoProps && protoProps.hasOwnProperty('constructor')) {
            child = protoProps.constructor;
        } else {
            child = function ParentWrapper() {
                return parent.apply(this, arguments);
            };
        }

        // Allow extenders to transform the
        for (var i = 0; i < mixinsInAndSelf.length; i += 1) {
            child = (mixinsInAndSelf[i].transformConstructor || identity)(child);
        }

        // Add static properties to the constructor function from parent
        // as well as ensuring that future extensions of this class use this
        // extender
        _.assign(child, parent, {extend: extend}, staticProps);

        // Classical inhertance example from MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create#Example:_Classical_inheritance_with_Object.create
        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;

        builderOpts.parent = parent;
        builderOpts.child = child;

        // Call the after extends callbacks that allow for extenders to
        // inject functionality
        _(mixinsInAndSelf).filter('beforeExtend').invoke('beforeExtend', builderOpts);

        assignProperties(child.prototype, protoProps);

        _(mixinsInAndSelf).filter('afterExtend').invoke('afterExtend', builderOpts);

        // Set a convenience property in case the parent's prototype is needed
        // later.
        child.__super__ = parent.prototype;
        return child;
    };

    /**
     * Make a new extender with the previous extender's functonality
     * @param   {[type]} optsOrExtender [description]
     * @returns {[type]}                [description]
     */
    extend.extend = function extend(optsOrExtender) {
        optsOrExtender || (optsOrExtender = {});

        var newExtender = extender();
        newExtender._mixedInExtenders = this._mixedInExtenders.concat([this]);

        if (_.isObject(optsOrExtender)) {
            newExtender.transformConstructor = optsOrExtender.transformConstructor;
            newExtender.beforeExtend = optsOrExtender.beforeExtend;
            newExtender.afterExtend = optsOrExtender.afterExtend;
            newExtender.options = optsOrExtender;
        } else if (_.isFunction(optsOrExtender)) {
            newExtender._mixedInExtenders.push(optsOrExtender);
        }

        return newExtender;
    };

    extend._mixedInExtenders = [];

    return extend;
}

module.exports = extender();
