var extender = require('./assign-properties');

module.exports = extender.extend({
  transformConstructor: function(Constructor) {
    return function Class(options) {
      options || (options = {});
      // don't leak arguments
      var args = new Array(arguments.length);
      for (var i = arguments.length - 1; i >= 0; i--) {
        args[i] = arguments[i];
      }

      var NewConstructor;

      if (!options._polymophic_hasTransformed) {
        NewConstructor = this.getPolymorphicClass.apply(this, args);
      }

      // Makes sure that a polymorphic class can't be infinitely recursive, only
      // one transformation possible.
      if (NewConstructor) {
        options._polymophic_hasTransformed = true;
        args[0] = options;

        if (args.length === 0) {
          return new NewConstructor();
        } else if (args.length === 1) {
          return new NewConstructor(args[0]);
        } else if (args.length === 2) {
          return new NewConstructor(args[0], args[1]);
        } else if (args.length === 3) {
          return new NewConstructor(args[0], args[1], args[2]);
        } else if (args.length === 4) {
          return new NewConstructor(args[0], args[1], args[2], args[3]);
        } else if (args.length === 5) {
          return new NewConstructor(args[0], args[1], args[2], args[3], args[4]);
        } else if (args.length === 6) {
          return new NewConstructor(args[0], args[1], args[2], args[3], args[4], args[5]);
        } else if (args.length === 7) {
          return new NewConstructor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        } else {
          return new NewConstructor(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
        }
      } else {
        return Constructor.apply(this, args);
      }
    };
  },

  properties: {
    polymorphicKey: 'type',

    getPolymorphicClass: function(options) {
      options || (options = {});

      var polymorphicKey = (typeof this.polymorphicKey === 'function') ? this.polymorphicKey(options) : this.polymorphicKey;

      var type = options[polymorphicKey];

      var classes;
      if (typeof this.polymorphicTypes === 'function') {
        classes = this.polymorphicTypes();
      } else if (this.polymorphicTypes) {
        classes = this.polymorphicTypes;
      } else {
        classes = {};
      }

      return classes[type];
    }
  }
});
