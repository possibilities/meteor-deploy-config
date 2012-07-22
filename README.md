# App Config

*Trix for managing deployment configurations*

## What's it for?

Sometimes a new instance of an app needs to be configured before it's useful. The package takes a simple approach to solving that problem. There are two components:

  1) A smart package that provides an `AppConfig` key/value store that's backed by Mongo.
  
  2) A command line app that prompts for each unsatisfied value and communicates them back to the deployed app (yes, over DDP!).

## How do I use it?

Start by fetching values from the `AppConfig` key/value store. If the value is already in `AppConfig` the callback gets called right away:

    AppConfig.get('googleSecret', function(secret) {
      Meteor.accounts.google.setSecret(secret);
    });

When you deploy your app run the command line utility and you'll be prompted for any values that your app needs to get from `AppConfig`. These values will be sent to the server, saved in `AppConfig` and their callbacks will be invoked:

    mconfig --host=localhost --port=3000

## TODO

Prefer https
