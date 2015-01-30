var _      = require('lodash');
var Events = require('backbone-events-standalone');

var extender = require('../index');

var eventExtender = extender.extend({
  beforeExtend: function(opts) {
    _.assign(opts.child.prototype, Events);
  }
});

module.exports = eventExtender;
