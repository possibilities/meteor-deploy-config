# Deploy Config

*Trix for managing Meteor deployment configurations*

## What's it for?

Sometimes a new instance of an app needs to be configured before it's useful. This library takes a simple approach to solving that problem. There are two components:

  1) A smart package that provides a `DeployConfig` key/value store that's backed by Mongo.
  
  2) A command line app that prompts for each unsatisfied value and communicates them back to the deployed app (yes, over DDP!).

## Installation

  1) Until there's a better way to install smart packages use [meteorite](http://possibilities.github.com/meteorite/)

  2) Install `mcfg` using npm

      npm install -g meteor-deploy-config

## How do I use it?

Start by fetching values from the `DeployConfig` key/value store. If the value is already in `DeployConfig` the callback gets called right away:

    DeployConfig.get('googleSecret', function(secret) {
      Meteor.accounts.google.setSecret(secret);
    });

After you deploy your app run the command line utility and you'll be prompted for any values that your app needs to get from `DeployConfig`. These values will be sent to the server, saved in `DeployConfig` and their callbacks will be invoked:

    mcfg --hostname cool-domain.com --port 3333

## Security recommendations

This package has no *real* security features of it's own. When you deploy an app that contains calls to `DeployConfig.get()` any `ddp` client can connect to it and set any unsatisfied values but after they are set they cannot be set again. Potentially I'll add authentication but I think for now this security-by-first-come-first-served is good enough for most environments. I recommend:

  * Do everything over SSL! When you specify port 443 `mcfg` will use the wss:// protocol.

  * If you need better security than this please help me add it!

  * For most environments running `mcfg` immediately after you deploy will be Secure Enough™

        meteor deploy cool-app && mcfg -h cool-app.meteor.com -p 443
