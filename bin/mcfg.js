#!/usr/bin/env node

var DDPClient = require('ddpclient');
var program = require('commander');
var _ = require('underscore');

program
  .option('-h, --hostname <hostname>', 'specify the server [localhost]', 'localhost')
  .option('-p, --port <port>', 'specify the server [3333]', Number, 3333)
  .parse(process.argv);

program.use_ssl = (program.port === 443) ? true : false;

var ddpclient = new DDPClient(program);

ddpclient.on("connect-error", function(data) {
  console.log("An error occured connecting to '" + ddpclient.socket_url + "'");
  process.exit();
});

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
