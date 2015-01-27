var extender = require('./assign-properties');

module.exports = extender.extend({
  properties: {
    _beforeHook: function(name, cb) {
      var beforeName = 'before_' + name;

      this._hookDelegates[beforeName] || (this._hookDelegates[beforeName] = []);

      this._hookDelegates[beforeName].push(cb);
    },

    _afterHook: function(name, cb) {
      var afterName = 'after_' + name;

      this._hookDelegates[afterName] || (this._hookDelegates[afterName] = []);

      this._hookDelegates[afterName].push(cb);
    },

    _triggerHooks: function(name, fn, args) {
      if (!args) {
        args = fn;
        fn = this[name];
      }

      var beforeName = 'before_' + name;
      var afterName = 'after_' + name;


      this._hookDelegates[beforeName] || (this._hookDelegates[beforeName] = []);
      this._hookDelegates[afterName] || (this._hookDelegates[afterName] = []);

      var i;
      var len = this._hookDelegates[beforeName].length;
      for (i = 0; i < len; i += 1) {
        this._hookDelegates[beforeName][i].apply(this, args);
      }

      var ret = fn.apply(this, args);

      len = this._hookDelegates[afterName].length;
      for (i = 0; i < len; i += 1) {
        this._hookDelegates[afterName][i].apply(this, args);
      }

      return ret;
    }
  }
});
