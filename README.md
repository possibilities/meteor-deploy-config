# App Config

*Trix for managing deployment configurations*

Sometimes a new instance of an app needs to be configured before it's useful. The package takes a simple approach to solving that problem. There are two components

  1) A smart package that provides an AppConfig key/value store that's backed by mongo.
  
  2) A command line app that prompts for each unsatisfied value (from step 1) and communicates them back to the deployed app (yes, over DDP!).
