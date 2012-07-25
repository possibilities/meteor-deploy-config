
DeployConfig = {};

DeployConfig.store = new Meteor.Collection('configStorage');
DeployConfig.store.allow({});

DeployConfig.callbacks = {};
DeployConfig.nullKeys = {};

DeployConfig.get = function(key, fn) {
  if (this.callbacks[key])
    this.callbacks[key].push(fn);
  else
    this.callbacks[key] = [fn];

  var val = this._getOrCreateConfig()[key];
  if (val) {
    _.each(this.callbacks[key], function(callback) {
      callback(val);
    });
    return val;
  } else {
    this.nullKeys[key] = true;
  }
};

DeployConfig.set = function(key, val) {
  var callbacks = this.callbacks[key];
  var id = this._getOrCreateConfig()._id;

  var updateValues = {};
  updateValues[key] = val;
  this.store.update(id, { $set: updateValues });
  delete this.nullKeys[key];

  _.each(callbacks, function(callback) {
    callback(val);
  }, this);
};

DeployConfig._getOrCreateConfig = function(key) {
  var config = this.store.findOne();
  if (!config) {
    config = {};
    this.store.insert(config);
  }
  return config;
};

Meteor.methods({
  getKeys: function() {
    return _.keys(DeployConfig.nullKeys);
  },

  setKeys: function(values) {
    var keys = Meteor.call('getKeys');

    _.each(keys, function(key) {
      DeployConfig.set(key, values[key]);
    });
  }
});
