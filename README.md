# App Config

Sometimes a new instance of an app needs to be configured before it's useful. The package takes a simple approach to solving that problem. There are two components

  1) A smart package that provides an AppConfig key/value store that's backed by mongo. The package also exposes an interface for declaring what values the app needs before it can run. (Note: for now it's all server side)
  
  2) A command line app that prompts for each unsatisfied value (from step 1) and communicates them back to the deployed app (yes, over DDP!). Ideally this would be a `meteor` subcommand.
