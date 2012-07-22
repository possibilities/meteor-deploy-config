#!/usr/bin/env node

var DDPClient, ddpclient;
var program = require('commander');
var _ = require('underscore');

DDPClient = require('ddpclient');
ddpclient = new DDPClient("localhost", 3000);

ddpclient.connect();

ddpclient.on("connect", function(data) {
  ddpclient.on("msg-result-getKeys", function(data) {
    var keys = data.result;
    
    if (keys.length <= 0) {
      console.log("All required config values are set. Nothing to do!");
      process.exit();
    }
    
    var promptValues = _.reduce(keys, function(memo, key) {
      memo[key] = key + ': ';
      return memo;
    }, {});
    program.prompt(promptValues, function(values) {
      ddpclient.on("msg-result-setKeys", function(data) {
        console.log("Done!");
        process.exit();
      });
      ddpclient.call("setKeys", [values]);
    });
  });
  ddpclient.call("getKeys");
});
