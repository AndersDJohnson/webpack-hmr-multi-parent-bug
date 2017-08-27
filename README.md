# webpack-hmr-multi-parent-bug

This project demonstrates an issue with Webpack's Hot Module Replacement feature
when the hot replaced module exists in two different dependency trees and only one
accepts the hot replacement.

The logic in the `HotModuleReplacementPlugin` seems to walk up the dependency tree of an updated module, but stops on any branch when it hits the main entry file and hasn't yet found an ancestor
 accepting the update, or hits a declining ancestor, regardless of whether there are other branches pending walk that could lead to other ancestors that might accept the update.

## 1.

Install dependencies:

```
yarn 
# or `npm install`
```

## 2.

Start the Webpack Dev Server:

```
yarn start
# or `npm start`
```

Or, if you need a different port, instead:

```
yarn start -- --port 10101
# or `npm start -- --port 10101`
```

## 3.

Visit [http://localhost:8080/](http://localhost:8080/) (or whatever port used in Step 2) in latest Chrome (or a modern browser supporting the ES2015 code used here).

Notice HMR is enabled by this message in the console:

> [WDS] Hot Module Replacement enabled.

## 4.

Edit `./src/dep.js`, e.g., by incrementing the value of its `val` variable.

Notice the following warnings in the console:

> Ignored an update to unaccepted module 92 -> 20 -> 94 -> 90 -> 38
>
> [HMR] The following modules couldn't be hot updated: (They would need a full reload!)

## 5.

Kill the server (`Ctrl+C` in terminal).

Comment out the `require('./ignorer')` in `./src/index.js`.

Restart server per Step 2.

Repeat Step 4 but notice now that HMR works with this message in the console:

> [HMR] Updated modules:
>
> ...
>
> [HMR] App is up to date.

Commenting this file out reduced the ancestry branches to one, so that the logic was not
short-circuited by the ignoring branch hitting the main file without an accept,
and the plugin was able to find the accepting ancestor.
