var _ = require('lodash');

var extender = require('../index');

module.exports = function mergeObjectExtender(propName) {
  return extender.extend({
    beforeExtend: function(opts) {
      if (opts.protoProps[propName] && opts.parent.prototype[propName]) {
        var newVals = opts.protoProps[propName];
        delete opts.protoProps[propName];
        opts.child.prototype[propName] = _.assign({}, opts.parent.prototype[propName], newVals);
      }
    }
  });
};
