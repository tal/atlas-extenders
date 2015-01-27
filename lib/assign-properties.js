var extender         = require('../index');
var assignProperties = require('./utils/assign-properties');

module.exports = extender.extend({
  beforeExtend: function(opts) {
    for (var i = 0; i < opts.mixinsInAndSelf.length; i += 1) {
      var newExtender = opts.mixinsInAndSelf[i];

      if (newExtender.options && newExtender.options.properties) {
        assignProperties(opts.child.prototype, newExtender.options.properties);
      }
    }
  }
});
