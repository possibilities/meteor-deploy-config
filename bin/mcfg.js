#!/usr/bin/env node

var DDPClient, ddpclient;
var program = require('commander');
var _ = require('underscore');

program
  .version('0.0.1')
  .option('-h, --host <host>', 'specify the server [yourapp.meteor.com]', 'localhost')
  .option('-p, --port <port>', 'specify the server [3333]', Number, 80)
  .parse(process.argv);

DDPClient = require('ddpclient');
ddpclient = new DDPClient(program.host, program.port);

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
