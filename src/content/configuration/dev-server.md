---
title: DevServer
sort: 11
contributors:
  - sokra
  - skipjack
  - spacek33z
  - charlespwd
  - orteth01
  - byzyk
  - EugeneHlushko
  - Yiidiir
  - Loonride
  - dmohns
  - EslamHiko
  - digitaljohn
  - bhavya9107
  - wizardofhogwarts
  - jamesgeorge007
  - g100g
  - anikethsaha
  - snitin315
---

[webpack-dev-server](https://github.com/webpack/webpack-dev-server) can be used to quickly develop an application. See the [development guide](/guides/development/) to get started.

This page describes the options that affect the behavior of webpack-dev-server (short: dev-server).

T> Options that are compatible with [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) have 🔑 next to them.

## `devServer`

`object`

This set of options is picked up by [webpack-dev-server](https://github.com/webpack/webpack-dev-server) and can be used to change its behavior in various ways. Here's a rudimentary example that gzips and serves everything from our `dist/` directory in the project root:

**webpack.config.js**

```javascript
var path = require('path');

module.exports = {
  //...
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
};
```

When the server is started, there will be a message prior to the list of resolved modules:

```bash
http://localhost:9000/
webpack output is served from /build/
Content not from webpack is served from /path/to/dist/
```

that will give some background on where the server is located and what it's serving.

If you're using dev-server through the Node.js API, the options in `devServer` will be ignored. Pass the options as a second parameter instead: `new WebpackDevServer(compiler, {...})`. [See here](https://github.com/webpack/webpack-dev-server/tree/master/examples/api/simple) for an example of how to use webpack-dev-server through the Node.js API.

W> You cannot use the second `compiler` argument (a callback) when using `WebpackDevServer`.

W> Be aware that when [exporting multiple configurations](/configuration/configuration-types/#exporting-multiple-configurations) only the `devServer` options for the first configuration will be taken into account and used for all the configurations in the array.

T> If you're having trouble, navigating to the `/webpack-dev-server` route will show where files are served. For example, `http://localhost:9000/webpack-dev-server`.

T> If you want to manually recompile the bundle, navigating to the `/invalidate` route will [invalidate](/api/node/#invalidate-watching) the current compilation of the bundle and recompile it for you via [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware#invalidate). Depending on your configuration, URL may look like `http://localhost:9000/invalidate`.

T> HTML template is required to serve the bundle, usually it is an `index.html` file. Make sure that script references are added into HTML, webpack-dev-server doesn't inject them automatically.

### Usage via CLI

You can invoke webpack-dev-server via CLI by:

```bash
npx webpack serve
```

A list of CLI options for `serve` is available [here](https://github.com/webpack/webpack-cli/blob/master/SERVE-OPTIONS.md)

## `devServer.after`

`function (app, server, compiler)`

Provides the ability to execute custom middleware after all other middleware
internally within the server.

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    after: function (app, server, compiler) {
      // do fancy stuff
    },
  },
};
```

## `devServer.allowedHosts`

`[string]`

This option allows you to whitelist services that are allowed to access the dev server.

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    allowedHosts: [
      'host.com',
      'subdomain.host.com',
      'subdomain2.host.com',
      'host2.com',
    ],
  },
};
```

Mimicking django's `ALLOWED_HOSTS`, a value beginning with `.` can be used as a subdomain wildcard. `.host.com` will match `host.com`, `www.host.com`, and any other subdomain of `host.com`.

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    // this achieves the same effect as the first example
    // with the bonus of not having to update your config
    // if new subdomains need to access the dev server
    allowedHosts: ['.host.com', 'host2.com'],
  },
};
```

To use this option with the CLI pass the `--allowed-hosts` as following:

```bash
npx webpack serve --entry ./entry/file --output-path ./output/path --allowed-hosts .host.com --allowed-hosts host2.com
```

## `devServer.before`

`function (app, server, compiler)`

Provides the ability to execute custom middleware prior to all other middleware
internally within the server. This could be used to define custom handlers, for
example:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    before: function (app, server, compiler) {
      app.get('/some/path', function (req, res) {
        res.json({ custom: 'response' });
      });
    },
  },
};
```

## `devServer.bonjour`

`boolean = false`

This option broadcasts the server via [ZeroConf](http://www.zeroconf.org/) networking on start

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    bonjour: true,
  },
};
```

Usage via the CLI

```bash
npx webpack serve --bonjour
```

## `devServer.clientLogLevel`

`string = 'info': 'silent' | 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'none' | 'warning'`

W> `silent`, `trace`, `debug`, and `warning` are going to be deprecated at the next major version.

When using _inline mode_, the console in your DevTools will show you messages e.g. before reloading, before an error or when [Hot Module Replacement](/concepts/hot-module-replacement/) is enabled.

`devServer.clientLogLevel` may be too verbose, you can turn logging off by setting it to `'silent'`.

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    clientLogLevel: 'silent',
  },
};
```

Usage via the CLI

```bash
npx webpack serve --client-log-level silent
```

## `devServer.compress`

`boolean`

Enable [gzip compression](https://betterexplained.com/articles/how-to-optimize-your-site-with-gzip-compression/) for everything served:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    compress: true,
  },
};
```

Usage via the CLI

```bash
npx webpack serve --compress
```

## `devServer.contentBase`

`boolean: false` `string` `[string]` `number`

Tell the server where to serve content from. This is only necessary if you want to serve static files. [`devServer.publicPath`](#devserverpublicpath-) will be used to determine where the bundles should be served from, and takes precedence.

T> It is recommended to use an absolute path.

By default, it will use your current working directory to serve content. To disable `contentBase` set it to `false`.

**webpack.config.js**

```javascript
const path = require('path');

module.exports = {
  //...
  devServer: {
    contentBase: path.join(__dirname, 'public'),
  },
};
```

It is also possible to serve from multiple directories in case you want to serve static content at multiple URLs with [`contentBasePublicPath`](#devservercontentbasepublicpath):

**webpack.config.js**

```javascript
const path = require('path');

module.exports = {
  //...
  devServer: {
    contentBase: [
      path.join(__dirname, 'public'),
      path.join(__dirname, 'assets'),
    ],
  },
};
```

Usage via the CLI

```bash
npx webpack serve --content-base ./path/to/content/dir
```

## `devServer.contentBasePublicPath`

`string = '/'` `[string]`

Tell the server at what URL to serve `devServer.contentBase` static content. If there was a file `assets/manifest.json`, it would be served at `/serve-content-base-at-this-url/manifest.json`

**webpack.config.js**

```javascript
const path = require('path');

module.exports = {
  //...
  devServer: {
    contentBase: path.join(__dirname, 'assets'),
    contentBasePublicPath: '/serve-content-base-at-this-url',
  },
};
```

Provide an array of strings in case you have multiple static folders set in [`contentBase`](#devservercontentbase).

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    contentBase: [contentBasePublic, contentBaseOther],
    contentBasePublicPath: [contentBasePublicPath, contentBasePublicOtherPath],
  },
};
```

## `devServer.disableHostCheck`

`boolean`

When set to `true` this option bypasses host checking. **THIS IS NOT RECOMMENDED** as apps that do not check the host are vulnerable to DNS rebinding attacks.

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    disableHostCheck: true,
  },
};
```

Usage via the CLI

```bash
npx webpack serve --disable-host-check
```

## `devServer.filename` 🔑

`string`

This option lets you reduce the compilations in [lazy mode](#devserverlazy-).
By default in [lazy mode](#devserverlazy-), every request results in a new compilation. With `filename`, it's possible to only compile when a certain file is requested.

If [`output.filename`](/configuration/output/#outputfilename) is set to `'bundle.js'` and `devServer.filename` is used like this:

**webpack.config.js**

```javascript
module.exports = {
  //...
  output: {
    filename: 'bundle.js',
  },
  devServer: {
    lazy: true,
    filename: 'bundle.js',
  },
};
```

It will now only compile the bundle when `/bundle.js` is requested.

T> `filename` has no effect when used without [lazy mode](#devserverlazy-).

## `devServer.headers` 🔑

`object`

Adds headers to all responses:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    headers: {
      'X-Custom-Foo': 'bar',
    },
  },
};
```

## `devServer.historyApiFallback`

`boolean = false` `object`

When using the [HTML5 History API](https://developer.mozilla.org/en-US/docs/Web/API/History), the `index.html` page will likely have to be served in place of any `404` responses. Enable `devServer.historyApiFallback` by setting it to `true`:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    historyApiFallback: true,
  },
};
```

By passing an object this behavior can be controlled further using options like `rewrites`:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/views/landing.html' },
        { from: /^\/subpage/, to: '/views/subpage.html' },
        { from: /./, to: '/views/404.html' },
      ],
    },
  },
};
```

When using dots in your path (common with Angular), you may need to use the `disableDotRule`:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    historyApiFallback: {
      disableDotRule: true,
    },
  },
};
```

Usage via the CLI

```bash
npx webpack serve --history-api-fallback
```

For more options and information, see the [connect-history-api-fallback](https://github.com/bripkens/connect-history-api-fallback) documentation.

## `devServer.host`

`string = 'localhost'`

Specify a host to use. If you want your server to be accessible externally, specify it like this:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    host: '0.0.0.0',
  },
};
```

Usage via the CLI

```bash
npx webpack serve --host 0.0.0.0
```

## `devServer.hot`

`boolean`

Enable webpack's [Hot Module Replacement](/concepts/hot-module-replacement/) feature:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    hot: true,
  },
};
```

T> Note that [`webpack.HotModuleReplacementPlugin`](/plugins/hot-module-replacement-plugin/) is required to fully enable HMR. If `webpack` or `webpack-dev-server` are launched with the `--hot` option, this plugin will be added automatically, so you may not need to add this to your `webpack.config.js`. See the [HMR concepts page](/concepts/hot-module-replacement/) for more information.

## `devServer.hotOnly`

`boolean`

Enables Hot Module Replacement (see [`devServer.hot`](#devserverhot)) without page refresh as a fallback in case of build failures.

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    hotOnly: true,
  },
};
```

Usage via the CLI

```bash
npx webpack serve --hot-only
```

## `devServer.http2`

`boolean = false`

Serve over HTTP/2 using [spdy](https://www.npmjs.com/package/spdy). This option is ignored for Node 10.0.0 and above, as spdy is broken for those versions. The dev server will migrate over to Node's built-in HTTP/2 once [Express](https://expressjs.com/) supports it.

If `devServer.http2` is not explicitly set to `false`, it will default to `true` when [`devServer.https`](#devserverhttps) is enabled. When `devServer.http2` is enabled but the server is unable to serve over HTTP/2, the server defaults to HTTPS.

HTTP/2 with a self-signed certificate:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    http2: true,
  },
};
```

Provide your own certificate using the [https](#devserverhttps) option:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    http2: true,
    https: {
      key: fs.readFileSync('/path/to/server.key'),
      cert: fs.readFileSync('/path/to/server.crt'),
      ca: fs.readFileSync('/path/to/ca.pem'),
    },
  },
};
```

Usage via CLI

```bash
npx webpack serve --http2
```

To pass your own certificate via CLI, use the following options

```bash
npx webpack serve --http2 --key ./path/to/server.key --cert ./path/to/server.crt --cacert ./path/to/ca.pem
```

## `devServer.https`

`boolean` `object`

By default, dev-server will be served over HTTP. It can optionally be served over HTTP/2 with HTTPS:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    https: true,
  },
};
```

With the above setting, a self-signed certificate is used, but you can provide your own:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    https: {
      key: fs.readFileSync('/path/to/server.key'),
      cert: fs.readFileSync('/path/to/server.crt'),
      ca: fs.readFileSync('/path/to/ca.pem'),
    },
  },
};
```

This object is passed straight to Node.js HTTPS module, so see the [HTTPS documentation](https://nodejs.org/api/https.html) for more information.

Usage via the CLI

```bash
npx webpack serve --https
```

To pass your own certificate via the CLI use the following options

```bash
npx webpack serve --https --key ./path/to/server.key --cert ./path/to/server.crt --cacert ./path/to/ca.pem
```

## `devServer.index`

`string`

The filename that is considered the index file.

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    index: 'index.html',
  },
};
```

## `devServer.injectClient`

`boolean = false` `function (compilerConfig) => boolean`

Tells `devServer` to inject a client. Setting `devServer.injectClient` to `true` will result in always injecting a client. It is possible to provide a function to inject conditionally:

```javascript
module.exports = {
  //...
  devServer: {
    injectClient: (compilerConfig) => compilerConfig.name === 'only-include',
  },
};
```

## `devServer.injectHot`

`boolean = false` `function (compilerConfig) => boolean`

Tells `devServer` to inject a Hot Module Replacement. Setting `devServer.injectHot` to `true` will result in always injecting. It is possible to provide a function to inject conditionally:

```javascript
module.exports = {
  //...
  devServer: {
    hot: true,
    injectHot: (compilerConfig) => compilerConfig.name === 'only-include',
  },
};
```

W> Make sure that [`devServer.hot`](#devserverhot) is set to `true` because `devServer.injectHot` only works with HMR.

## `devServer.inline`

`boolean`

Toggle between the dev-server's two different modes. By default, the application will be served with _inline mode_ enabled. This means that a script will be inserted in your bundle to take care of live reloading, and build messages will appear in the browser console.

It is also possible to use **iframe mode**, which uses an `<iframe>` under a notification bar with messages about the build. To switch to **iframe mode**:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    inline: false,
  },
};
```

Usage via the CLI

```bash
npx webpack serve --inline
```

Notice that there's no way to disable it from CLI.

T> Inline mode is recommended for [Hot Module Replacement](/plugins/hot-module-replacement-plugin/) as it includes an HMR trigger from the websocket. Polling mode can be used as an alternative, but requires an additional entry point, `'webpack/hot/poll?1000'`.

## `devServer.lazy` 🔑

`boolean`

When `devServer.lazy` is enabled, the dev-server will only compile the bundle when it gets requested. This means that webpack will not watch any file changes. We call this **lazy mode**.

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    lazy: true,
  },
};
```

Usage via the CLI

```bash
npx webpack serve --lazy
```

T> [`watchOptions`](#devserverwatchoptions-) will have no effect when used with **lazy mode**.

T> If you use the CLI, make sure **inline mode** is disabled.

## `devServer.liveReload`

`boolean = true`

By default, the dev-server will reload/refresh the page when file changes are detected. [`devServer.hot`](#devserverhot) option must be disabled or [`devServer.watchContentBase`](#devserverwatchcontentbase) option must be enabled in order for `liveReload` to take effect. Disable `devServer.liveReload` by setting it to `false`:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    liveReload: false,
  },
};
```

Usage via the CLI

```bash
npx webpack serve --liveReload
```

Notice that there's no way to disable it from CLI.

W> Live reloading works only with web related [targets](/configuration/target/#string) like `web`, `webworker`, `electron-renderer` and `node-webkit`.

## `devServer.mimeTypes` 🔑

`object`

Allows dev-server to register custom mime types.
The object is passed to the underlying `webpack-dev-middleware`.
See [documentation](https://github.com/webpack/webpack-dev-middleware#mimetypes) for usage notes.

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    mimeTypes: { 'text/html': ['phtml'] },
  },
};
```

## `devServer.noInfo` 🔑

`boolean = false`

Tells dev-server to suppress messages like the webpack bundle information. Errors and warnings will still be shown.

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    noInfo: true,
  },
};
```

## `devServer.onListening`

`function (server)`

Provides an option to execute a custom function when `webpack-dev-server` starts listening for connections on a port.

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    onListening: function (server) {
      const port = server.server.address().port;
      console.log('Listening on port:', port);
    },
  },
};
```

## `devServer.open`

`boolean = false` `string` `object`

Tells dev-server to open the browser after server had been started. Set it to `true` to open your default browser.

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    open: true,
  },
};
```

Provide browser name to use instead of the default one:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    open: 'Google Chrome',
  },
};
```

If you want to use flags when opening the browser like opening an incognito window (`--incognito` flag), you can set `open` to an object. The object accepts all [open](https://www.npmjs.com/package/open) options, `app` property must be an array. The first element in the array must be the browser name and the other following elements are the flags you want to use. For example:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    open: {
      app: ['Google Chrome', '--incognito', '--other-flag'],
    },
  },
};
```

Usage via the CLI

```bash
npx webpack serve --open 'Google Chrome'
```

T> The browser application name is platform dependent. Don't hard code it in reusable modules. For example, `'Chrome'` is `'Google Chrome'` on macOS, `'google-chrome'` on Linux and `'chrome'` on Windows.

## `devServer.openPage`

`string` `[string]`

Specify a page to navigate to when opening the browser.

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    open: true,
    openPage: 'different/page',
  },
};
```

Usage via the CLI

```bash
npx webpack serve --open --open-page different/page
```

W> Do not prepend `/` for the page as webpack-dev-server will do it automatically, otherwise the browser will open urls like `http://localhost:8080//different/page`.

If you wish to specify multiple pages to open in the browser.

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    open: true,
    openPage: ['different/page1', 'different/page2'],
  },
};
```

Usage via the CLI

```bash
npx webpack serve --open --open-page different/page1 --open-page different/page2
```

## `devServer.overlay`

`boolean = false` `object: { errors boolean = false, warnings boolean = false }`

Shows a full-screen overlay in the browser when there are compiler errors or warnings. If you want to show only compiler errors:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    overlay: true,
  },
};
```

If you want to show warnings as well as errors:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    overlay: {
      warnings: true,
      errors: true,
    },
  },
};
```

## `devServer.pfx`

`string`

When used via the CLI, a path to an SSL .pfx file. If used in options, it should be the bytestream of the .pfx file.

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    pfx: './path/to/file.pfx',
  },
};
```

Usage via the CLI

```bash
npx webpack serve --pfx ./path/to/file.pfx
```

## `devServer.pfxPassphrase`

`string`

The passphrase to a SSL PFX file.

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    pfxPassphrase: 'passphrase',
  },
};
```

Usage via the CLI

```bash
npx webpack serve --pfx-passphrase passphrase
```

## `devServer.port`

`number`

Specify a port number to listen for requests on:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    port: 8080,
  },
};
```

Usage via the CLI

```bash
npx webpack serve --port 8080
```

## `devServer.proxy`

`object` `[object, function]`

Proxying some URLs can be useful when you have a separate API backend development server and you want to send API requests on the same domain.

The dev-server makes use of the powerful [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) package. Check out its [documentation](https://github.com/chimurai/http-proxy-middleware#options) for more advanced usages. Note that some of `http-proxy-middleware`'s features do not require a `target` key, e.g. its `router` feature, but you will still need to include a `target` key in your configuration here, otherwise `webpack-dev-server` won't pass it along to `http-proxy-middleware`).

With a backend on `localhost:3000`, you can use this to enable proxying:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
};
```

A request to `/api/users` will now proxy the request to `http://localhost:3000/api/users`.

If you don't want `/api` to be passed along, we need to rewrite the path:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: { '^/api': '' },
      },
    },
  },
};
```

A backend server running on HTTPS with an invalid certificate will not be accepted by default. If you want to, modify your configuration like this:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': {
        target: 'https://other-server.example.com',
        secure: false,
      },
    },
  },
};
```

Sometimes you don't want to proxy everything. It is possible to bypass the proxy based on the return value of a function.

In the function you get access to the request, response, and proxy options.

- Return `null` or `undefined` to continue processing the request with proxy.
- Return `false` to produce a 404 error for the request.
- Return a path to serve from, instead of continuing to proxy the request.

E.g. for a browser request, you want to serve an HTML page, but for an API request you want to proxy it. You could do something like this:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        bypass: function (req, res, proxyOptions) {
          if (req.headers.accept.indexOf('html') !== -1) {
            console.log('Skipping proxy for browser request.');
            return '/index.html';
          }
        },
      },
    },
  },
};
```

If you want to proxy multiple, specific paths to the same target, you can use an array of one or more objects with a `context` property:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    proxy: [
      {
        context: ['/auth', '/api'],
        target: 'http://localhost:3000',
      },
    ],
  },
};
```

Note that requests to root won't be proxied by default. To enable root proxying, the `devServer.index` option should be specified as a falsy value:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    index: '', // specify to enable root proxying
    host: '...',
    contentBase: '...',
    proxy: {
      context: () => true,
      target: 'http://localhost:1234',
    },
  },
};
```

The origin of the host header is kept when proxying by default, you can set `changeOrigin` to `true` to override this behaviour. It is useful in some cases like using [name-based virtual hosted sites](https://en.wikipedia.org/wiki/Virtual_hosting#Name-based).

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
};
```

## `devServer.progress` - CLI only

`boolean`

Output running progress to console.

```bash
npx webpack serve --progress
```

## `devServer.public`

`string`

When using _inline mode_ and you're proxying dev-server, the inline client script does not always know where to connect to. It will try to guess the URL of the server based on `window.location`, but if that fails you'll need to use this.

For example, the dev-server is proxied by nginx, and available on `myapp.test`:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    public: 'myapp.test:80',
  },
};
```

Usage via the CLI

```bash
npx webpack serve --public myapp.test:80
```

## `devServer.publicPath` 🔑

`string = '/'`

The bundled files will be available in the browser under this path.

Imagine that the server is running under `http://localhost:8080` and [`output.filename`](/configuration/output/#outputfilename) is set to `bundle.js`. By default the `devServer.publicPath` is `'/'`, so your bundle is available as `http://localhost:8080/bundle.js`.

Change `devServer.publicPath` to put bundle under specific directory:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    publicPath: '/assets/',
  },
};
```

The bundle will now be available as `http://localhost:8080/assets/bundle.js`.

T> Make sure `devServer.publicPath` always starts and ends with a forward slash.

It is also possible to use a full URL.

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    publicPath: 'http://localhost:8080/assets/',
  },
};
```

The bundle will also be available as `http://localhost:8080/assets/bundle.js`.

T> It is recommended that `devServer.publicPath` is the same as [`output.publicPath`](/configuration/output/#outputpublicpath).

## `devServer.quiet` 🔑

`boolean`

With `devServer.quiet` enabled, nothing except the initial startup information will be written to the console. This also means that errors or warnings from webpack are not visible.

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    quiet: true,
  },
};
```

Usage via the CLI

```bash
npx webpack serve --quiet
```

## `devServer.serveIndex`

`boolean = true`

Tells dev-server to use [`serveIndex`](https://github.com/expressjs/serve-index) middleware when enabled.

[`serveIndex`](https://github.com/expressjs/serve-index) middleware generates directory listings on viewing directories that don't have an index.html file.

```javascript
module.exports = {
  //...
  devServer: {
    serveIndex: true,
  },
};
```

Usage via the CLI

```bash
npx webpack serve --serveIndex
```

## `devServer.setup`

`function (app, server)`

W> This option is **deprecated** in favor of [`devServer.before`](#devserverbefore) and will be removed in v4.0.0.

Here you can access the Express app object and add your own custom middleware to it.
For example, to define custom handlers for some paths:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    setup: function (app, server) {
      app.get('/some/path', function (req, res) {
        res.json({ custom: 'response' });
      });
    },
  },
};
```

## `devServer.sockHost`

`string`

Tells clients connected to `devServer` to use provided socket host.

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    sockHost: 'myhost.test',
  },
};
```

## `devServer.sockPath`

`string = '/sockjs-node'`

The path at which to connect to the reloading socket.

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    sockPath: '/socket',
  },
};
```

Usage via the CLI

```bash
npx webpack serve --sock-path /socket
```

## `devServer.sockPort`

`number` `string`

Tells clients connected to `devServer` to use provided socket port.

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    sockPort: 8080,
  },
};
```

## `devServer.staticOptions`

`object`

It is possible to configure advanced options for serving static files from `contentBase`. See the [Express documentation](http://expressjs.com/en/4x/api.html#express.static) for the possible options.

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    staticOptions: {
      redirect: false,
    },
  },
};
```

T> This only works when using [`devServer.contentBase`](#devservercontentbase) as a `string`.

## `devServer.stats` 🔑

`string: 'none' | 'errors-only' | 'minimal' | 'normal' | 'verbose'` `object`

This option lets you precisely control what bundle information gets displayed. This can be a nice middle ground if you want some bundle information, but not all of it.

To show only errors in your bundle:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    stats: 'errors-only',
  },
};
```

For more information, see the [**stats documentation**](/configuration/stats/).

T> This option has no effect when used with `quiet` or `noInfo`.

## `devServer.stdin` - CLI only

`boolean`

This option closes the server when stdin ends.

```bash
npx webpack serve --stdin
```

## `devServer.transportMode`

`string = 'sockjs': 'sockjs' | 'ws'` `object`

W> `transportMode` is an experimental option, meaning its usage could potentially change without warning.

T> Providing a string to `devServer.transportMode` is a shortcut to setting both `devServer.transportMode.client` and `devServer.transportMode.server` to the given string value.

This option allows us either to choose the current `devServer` transport mode for client/server individually or to provide custom client/server implementation. This allows to specify how browser or other client communicates with the `devServer`.

The current default mode is [`'sockjs'`](https://www.npmjs.com/package/sockjs). This mode uses [SockJS-node](https://github.com/sockjs/sockjs-node) as a server, and [SockJS-client](https://www.npmjs.com/package/sockjs-client) on the client.

`'ws'` mode will become the default mode in the next major `devServer` version. This mode uses [ws](https://www.npmjs.com/package/ws) as a server, and native WebSockets on the client.

Use `'ws'` mode:

```javascript
module.exports = {
  //...
  devServer: {
    transportMode: 'ws',
  },
};
```

T> When providing a custom client and server implementation make sure that they are compatible with one another to communicate successfully.

### `devServer.transportMode.client`

`string` `path`

To create a custom client implementation, create a class that extends [`BaseClient`](https://github.com/webpack/webpack-dev-server/blob/master/client-src/clients/BaseClient.js).

Using path to `CustomClient.js`, a custom WebSocket client implementation, along with the compatible `'ws'` server:

```javascript
module.exports = {
  //...
  devServer: {
    transportMode: {
      client: require.resolve('./CustomClient'),
      server: 'ws',
    },
  },
};
```

### `devServer.transportMode.server`

`string` `path` `function`

To create a custom server implementation, create a class that extends [`BaseServer`](https://github.com/webpack/webpack-dev-server/blob/master/lib/servers/BaseServer.js).

Using path to `CustomServer.js`, a custom WebSocket server implementation, along with the compatible `'ws'` client:

```javascript
module.exports = {
  //...
  devServer: {
    transportMode: {
      client: 'ws',
      server: require.resolve('./CustomServer'),
    },
  },
};
```

Using class exported by `CustomServer.js`, a custom WebSocket server implementation, along with the compatible `'ws'` client:

```javascript
module.exports = {
  //...
  devServer: {
    transportMode: {
      client: 'ws',
      server: require('./CustomServer'),
    },
  },
};
```

Using custom, compatible WebSocket client and server implementations:

```javascript
module.exports = {
  //...
  devServer: {
    transportMode: {
      client: require.resolve('./CustomClient'),
      server: require.resolve('./CustomServer'),
    },
  },
};
```

## `devServer.useLocalIp`

`boolean`

This option lets the browser open with your local IP.

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    useLocalIp: true,
  },
};
```

Usage via the CLI

```bash
npx webpack serve --useLocalIp
```

## `devServer.watchContentBase`

`boolean`

Tell dev-server to watch the files served by the [`devServer.contentBase`](#devservercontentbase) option. It is disabled by default. When enabled, file changes will trigger a full page reload.

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    watchContentBase: true,
  },
};
```

Usage via the CLI

```bash
npx webpack serve --watch-content-base
```

## `devServer.watchOptions` 🔑

`object`

Control options related to watching the files.

webpack uses the file system to get notified of file changes. In some cases, this does not work. For example, when using Network File System (NFS). [Vagrant](https://www.vagrantup.com/) also has a lot of problems with this. In these cases, use polling:

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    watchOptions: {
      poll: true,
    },
  },
};
```

If this is too heavy on the file system, you can change this to an integer to set the interval in milliseconds.

See [WatchOptions](/configuration/watch/) for more options.

## `devServer.writeToDisk` 🔑

`boolean = false` `function (filePath) => boolean`

Tells `devServer` to write generated assets to the disk. The output is written to the [output.path](/configuration/output/#outputpath) directory.

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    writeToDisk: true,
  },
};
```

Providing a `Function` to `devServer.writeToDisk` can be used for filtering. The function follows the same premise as [`Array#filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) in which a boolean return value tells if the file should be written to disk.

**webpack.config.js**

```javascript
module.exports = {
  //...
  devServer: {
    writeToDisk: (filePath) => {
      return /superman\.css$/.test(filePath);
    },
  },
};
```

T> It is possible to set any Node.js flags via `NODE_OPTIONS`, for example, to configure `HTTP_MAX_HEADER_SIZE`:

**package.json**

```json
{
  "scripts": "NODE_OPTIONS='--max-http-header-size=100000' webpack serve"
}
```
