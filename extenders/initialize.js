var extender = require('./assign-properties');

module.exports = extender.extend({
  transformConstructor: function(Constructor) {
    return function Class() {
      Constructor.apply(this, arguments);
      return this.initialize.apply(this, arguments);
    };
  },

  properties: {
    initialize: function() {
      console.log('in base initialize');
    }
  }
});
