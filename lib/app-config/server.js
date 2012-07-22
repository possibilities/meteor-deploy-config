
AppConfig = {};

AppConfig.store = new Meteor.Collection('configStorage');
AppConfig.store.allow({});

AppConfig.callbacks = {};
AppConfig.nullKeys = {};

AppConfig.get = function(key, fn) {
  if (this.callbacks[key])
    this.callbacks[key].push(fn);
  else {
    this.nullKeys[key] = true;
    this.callbacks[key] = [fn];
  }

  var val = this._getOrCreateConfig()[key];
  if (val) {
    _.each(this.callbacks[key], function(callback) {
      callback(val);
    }, this);
    return val;
  }
};

AppConfig.set = function(key, val) {
  var callbacks = this.callbacks[key];
  var id = this._getOrCreateConfig()._id;

  var updateValues = {};
  updateValues[key] = val;
  this.store.update(id, updateValues);
  delete this.nullKeys[key];

  _.each(callbacks, function(callback) {
    callback(val);
  }, this);
};

AppConfig._getOrCreateConfig = function(key) {
  var config = this.store.findOne();
  if (!config) {
    config = {};
    this.store.insert(config);
  }
  return config;
};

Meteor.methods({
  getKeys: function() {
    return _.keys(AppConfig.nullKeys);
  },

  setKeys: function(values) {
    var keys = Meteor.call('getKeys');

    _.each(keys, function(key) {
      AppConfig.set(key, values[key]);
    });
  }
});
