var extender = require('../index');

module.exports = function concatArrayExtender(propName) {
  return extender.extend({
    beforeExtend: function(opts) {
      if (opts.protoProps[propName] && opts.parent.prototype[propName]) {
        opts.protoProps[propName] = opts.parent.prototype[propName].concat(opts.protoProps[propName]);
      }
    }
  });
};
