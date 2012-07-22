
AppConfig = {};

AppConfig.store = new Meteor.Collection('configStorage');
AppConfig.store.allow({});

AppConfig.callbacks = {};

AppConfig.get = function(key, fn) {
  if (this.callbacks[key])
    this.callbacks[key].push(fn);
  else
    this.callbacks[key] = [fn];

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
