---
title: Debugging
sort: 7
contributors:
  - skipjack
  - tbroadley
  - madhavarshney
  - bhavya9107
  - fokusferit
related:
  - title: Learn and Debug webpack with Chrome DevTools!
    url: https://medium.com/webpack/webpack-bits-learn-and-debug-webpack-with-chrome-dev-tools-da1c5b19554
  - title: Debugging Guide | Node
    url: https://nodejs.org/en/docs/guides/debugging-getting-started/
  - title: Debugging Node.js with Chrome DevTools
    url: https://medium.com/@paul_irish/debugging-node-js-nightlies-with-chrome-devtools-7c4a1b95ae27
---

When contributing to the core repo, writing a loader/plugin, or working on a complex project, debugging tools can be central to your workflow. Whether the problem is slow performance on a large project or an unhelpful traceback, the following utilities can make figuring it out less painful.

- The [`stats` data](/api/stats) made available through [Node](/api/node/#stats-object) and the [CLI](/api/cli/#common-options).
- Chrome __DevTools__ via `node-nightly` and the latest Node.js versions.


## Stats

Whether you want to sift through [this data](/api/stats) manually or use a tool to process it, the `stats` data can be extremely useful when debugging build issues. We won't go in depth here as there's an [entire page](/api/stats) dedicated to its contents, but know that you can use it to find the following information:

- The contents of every module.
- The modules contained within every chunk.
- Per module compilation and resolving stats.
- Build errors and warnings.
- The relationships between modules.
- And much more...

On top of that, the official [analyze tool](https://github.com/webpack/analyse) and [various others](/guides/code-splitting/#bundle-analysis) will accept this data and visualize it in various ways.


## DevTools

While [`console`](https://nodejs.org/api/console.html) statements may work well in simpler scenarios, sometimes a more robust solution is needed. As most front-end developers already know, Chrome DevTools are a life saver when debugging web applications, _but they don’t have to stop there_. As of Node v6.3.0+, developers can use the built-in `--inspect` flag to debug a node program in DevTools.

This gives you the ability to create breakpoints, debug memory usage, expose and examine objects in the console, and much more without adding complexity. In this short demo, we'll utilize the [`node-nightly`](https://github.com/hemanth/node-nightly) package which provides access to the latest and greatest inspecting capabilities.

W> The `--inspect` interface has been available since v6.3.0 so feel to try it out with your local version, but be warned that certain features and flags may differ from the ones in this demo.

Let's start by installing it globally:

``` bash
npm install --global node-nightly
```

Now, we'll need to run it once to finish the installation:

``` bash
node-nightly
```

Now, we can use `node-nightly` along with the `--inspect` flag to start our build in any webpack-based project. Note that we cannot run NPM `scripts`, e.g. `npm run build`, so we'll have to specify the full `node_modules` path:

``` bash
node-nightly --inspect ./node_modules/webpack/bin/webpack.js
```

Which should output something like:

``` bash
Debugger listening on ws://127.0.0.1:9229/c624201a-250f-416e-a018-300bbec7be2c
For help see https://nodejs.org/en/docs/inspector
```

Now jump to `chrome://inspect` in the browser and you should see any active scripts you've inspected under the _Remote Target_ header. Click the "inspect" link under each script to open a dedicated debugger or the _Open dedicated DevTools for Node_ link for a session that will connect automatically. You can also check out the [NiM extension](https://chrome.google.com/webstore/detail/nodejs-v8-inspector-manag/gnhhdgbaldcilmgcpfddgdbkhjohddkj), a handy Chrome plugin that will automatically open a DevTools tab every time you `--inspect` a script.

We recommend using the `--inspect-brk` flag which will break on the first statement of the script allowing you to go through the source to set breakpoints and start/stop the build as you please. Also, don't forget that you can still pass arguments to the script. For example, if you have multiple configuration files you could pass `--config webpack.prod.js` to specify the configuration you'd like to debug.
