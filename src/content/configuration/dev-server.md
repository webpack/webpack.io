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
  - tigt
---

[webpack-dev-server](https://github.com/webpack/webpack-dev-server) can be used to quickly develop an application. See the [development guide](/guides/development/) to get started.

This page describes the options that affect the behavior of webpack-dev-server (short: dev-server).

T> Options compatible with [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) have 🔑 next to them.

## `devServer`

`object`

This set of options is picked up by [webpack-dev-server](https://github.com/webpack/webpack-dev-server) to change its behavior. Here's an example that gzips and serves everything from our `dist/` directory in the project root:

__webpack.config.js__

```javascript
var path = require('path');

module.exports = {
  //...
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  }
};
```

When the server starts, there will be a message prior to the list of resolved modules:

```bash
http://localhost:9000/
webpack output is served from /build/
Content not from webpack is served from /path/to/dist/
```

That will give some background on the server's address and what it's serving.

If you're using dev-server through [the Node.js API](/api/node/), the options in `devServer` will be ignored. Pass the options as a second parameter instead: `new WebpackDevServer(compiler, {...})`. [See an example of how to use webpack-dev-server with the Node.js API.](https://github.com/webpack/webpack-dev-server/tree/master/examples/api/simple)

W> You cannot use the second `compiler` argument (a callback) when using `WebpackDevServer`.

W> When [exporting multiple configurations](/configuration/configuration-types/#exporting-multiple-configurations), only the `devServer` options for the __first__ configuration will be taken into account, then used for all configurations in the array.

T> If you're having trouble, navigating to the `/webpack-dev-server` route will show where files are served. For example, `http://localhost:9000/webpack-dev-server`.

T> An HTML template is required to serve the bundle; usually an `index.html` file. Make sure that script references are added into that HTML, as webpack-dev-server doesn't inject them automatically.

## `devServer.after`

`function (app, server, compiler)`

Executes custom middleware after all other middlewares run within the server.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    after: function(app, server, compiler) {
      // do fancy stuff
    }
  }
};
```

## `devServer.allowedHosts`

`[string]`

Lists service hostnames that are allowed to access the dev server.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    allowedHosts: [
      'host.com',
      'subdomain.host.com',
      'subdomain2.host.com',
      'host2.com'
    ]
  }
};
```

Similar to [django's `ALLOWED_HOSTS`](https://docs.djangoproject.com/en/2.2/ref/settings/#allowed-hosts), a value beginning with `.` is a subdomain wildcard: `.host.com` will match `host.com`, `www.host.com`, and any other subdomain of `host.com`.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    // this achieves the same effect as the first example,
    // with the bonus of not having to update your config
    // for new host.com subdomains to access the dev server
    allowedHosts: [
      '.host.com',
      'host2.com'
    ]
  }
};
```

To use this option with the CLI, pass the `--allowed-hosts` flag a comma-delimited string:

```bash
webpack-dev-server --entry /entry/file --output-path /output/path --allowed-hosts .host.com,host2.com
```

## `devServer.before`

`function (app, server, compiler)`

Executes custom middleware before all other middlewares within the server. This could be used to define custom handlers, for
example:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    before: function(app, server, compiler) {
      app.get('/some/path', function(req, res) {
        res.json({ custom: 'response' });
      });
    }
  }
};
```

## `devServer.bonjour`

`boolean = false`

Broadcasts the server via [ZeroConf networking](http://www.zeroconf.org/) on start.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    bonjour: true
  }
};
```

Usage via the CLI:

```bash
webpack-dev-server --bonjour
```

## `devServer.clientLogLevel`

`string = 'info': 'silent' | 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'none' | 'warning'`

W> `none` and `warning` are deprecated.

When using _inline mode_, your browser DevTools console will show messages — e.g. before reloading, before an error, or when [Hot Module Replacement](/concepts/hot-module-replacement/) is enabled. Defaults to `info`.

If the logs are too verbose, you can turn them off by setting `devServer.clientLogLevel: 'silent'`:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    clientLogLevel: 'silent'
  }
};
```

Usage via the CLI:

```bash
webpack-dev-server --client-log-level silent
```

## `devServer.color` — CLI only

`boolean`

Enables/disables colors on the console.

```bash
webpack-dev-server --color
```

## `devServer.compress`

`boolean`

Enable [gzip compression](https://betterexplained.com/articles/how-to-optimize-your-site-with-gzip-compression/) for everything served:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    compress: true
  }
};
```

Usage via the CLI:

```bash
webpack-dev-server --compress
```

## `devServer.contentBase`

`boolean: false` `string` `[string]` `number`

Tell the server where to serve content from. Only necessary if you want to serve static files. [`devServer.publicPath`](#devserverpublicpath-) will be used to determine where the bundles should be served from, and takes precedence.

T> It is recommended to use an absolute path.

By default, uses your current working directory to serve content. To disable `contentBase`, set it to `false`:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    contentBase: path.join(__dirname, 'public')
  }
};
```

It is also possible to serve static content from multiple directories:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    contentBase: [path.join(__dirname, 'public'), path.join(__dirname, 'assets')]
  }
};
```

Usage via the CLI:

```bash
webpack-dev-server --content-base /path/to/content/dir
```

## `devServer.disableHostCheck`

`boolean`

When set to `true`, this option bypasses host checking. __THIS IS NOT RECOMMENDED__ as apps that do not check the host are vulnerable to DNS rebinding attacks.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    disableHostCheck: true
  }
};
```

Usage via the CLI:

```bash
webpack-dev-server --disable-host-check
```

## `devServer.filename` 🔑

`string`

Reduces the compilations in [lazy mode](#devserver-lazy-).

By default in [lazy mode](#devserver-lazy-), every request results in a new compilation. By setting `filename`, it's possible to only compile when that file is requested.

If [`output.filename`](/configuration/output/#output-filename) is set to `'bundle.js'`, and `devServer.filename` is used like this:

__webpack.config.js__

```javascript
module.exports = {
  //...
  output: {
    filename: 'bundle.js'
  },
  devServer: {
    lazy: true,
    filename: 'bundle.js'
  }
};
```

…it will now only recompile the bundle when `/bundle.js` is requested.

T> `filename` has no effect when used without [lazy mode](#devserverlazy-).

## `devServer.headers` 🔑

`object`

Adds headers to all responses:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    headers: {
      'X-Custom-Foo': 'bar'
    }
  }
};
```

## `devServer.historyApiFallback`

`boolean = false` `object`

When using the [HTML5 History API](https://developer.mozilla.org/en-US/docs/Web/API/History), the `index.html` page will likely have to be served in place of any `404` responses. Disabled by default. Enable it by passing:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    historyApiFallback: true
  }
};
```

By passing an object, this behavior can be controlled further with options like `rewrites`:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/views/landing.html' },
        { from: /^\/subpage/, to: '/views/subpage.html' },
        { from: /./, to: '/views/404.html' }
      ]
    }
  }
};
```

When using dots in your path (common with Angular), you may need the `disableDotRule`:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    historyApiFallback: {
      disableDotRule: true
    }
  }
};
```

Usage via the CLI:

```bash
webpack-dev-server --history-api-fallback
```

For more options and information, see the [connect-history-api-fallback](https://github.com/bripkens/connect-history-api-fallback) documentation.

## `devServer.host`

`string = 'localhost'`

Specify a hostname to use. Is `localhost` by default. If you want your server to be accessible externally, specify it like this:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    host: '0.0.0.0'
  }
};
```

Usage via the CLI:

```bash
webpack-dev-server --host 0.0.0.0
```

## `devServer.hot`

`boolean`

Enable webpack's [Hot Module Replacement](/concepts/hot-module-replacement/) feature:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    hot: true
  }
};
```

T> Note that [`webpack.HotModuleReplacementPlugin`](/plugins/hot-module-replacement-plugin/) is required to fully enable HMR. If `webpack` or `webpack-dev-server` are launched with the `--hot` option, this plugin will be added automatically, so you may not need to add this to your `webpack.config.js`. See the [HMR concepts page](/concepts/hot-module-replacement/) for more information.

## `devServer.hotOnly`

`boolean`

Enables Hot Module Replacement (see [`devServer.hot`](#devserverhot)) without page refresh as fallback, in case of build failures.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    hotOnly: true
  }
};
```

Usage via the CLI:

```bash
webpack-dev-server --hot-only
```

## `devServer.http2`

`boolean = false`

Serve over HTTP/2 using [spdy](https://www.npmjs.com/package/spdy). This option is ignored for Node 10.0.0 and above, as spdy is broken for those versions. The dev server will migrate over to Node's built-in HTTP/2 once [Express](https://expressjs.com/) supports it.

If `devServer.http2` is not explicitly set to `false`, it will default to `true` when [`devServer.https`](#devserverhttps) is enabled. When `devServer.http2` is enabled but the server is unable to serve over HTTP/2, the server defaults to HTTPS.

HTTP/2 with a self-signed certificate:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    http2: true
  }
};
```

Provide your own certificate using the [https](#devserverhttps) option:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    http2: true,
    https: {
      key: fs.readFileSync('/path/to/server.key'),
      cert: fs.readFileSync('/path/to/server.crt'),
      ca: fs.readFileSync('/path/to/ca.pem'),
    }
  }
};
```

Usage via CLI:

```bash
webpack-dev-server --http2
```

To pass your own certificate via CLI, use the following options:

```bash
webpack-dev-server --http2 --key /path/to/server.key --cert /path/to/server.crt --cacert /path/to/ca.pem
```

## `devServer.https`

`boolean` `object`

By default, dev-server will be served over HTTP. It can optionally be served over HTTP/2 with HTTPS:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    https: true
  }
};
```

The above setting uses a self-signed certificate, but you can provide your own:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    https: {
      key: fs.readFileSync('/path/to/server.key'),
      cert: fs.readFileSync('/path/to/server.crt'),
      ca: fs.readFileSync('/path/to/ca.pem'),
    }
  }
};
```

This object is passed straight to [the Node.js `https` module](https://nodejs.org/api/https.html).

Usage via the CLI:

```bash
webpack-dev-server --https
```

To pass your own certificate via the CLI, use the following options:

```bash
webpack-dev-server --https --key /path/to/server.key --cert /path/to/server.crt --cacert /path/to/ca.pem
```

## `devServer.index`

`string`

The filename for the web server index, served at the root `/` path.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    index: 'index.html'
  }
};
```

## `devServer.info` — CLI only

`boolean`

Output CLI information. Enabled by default.

```bash
webpack-dev-server --info=false
```

## `devServer.injectClient`

`boolean: false` `function (compilerConfig) => boolean`

Tells `devServer` whether to inject a client. `true` will always inject a client. It is possible to provide a function to inject conditionally:

```javascript
module.exports = {
  //...
  devServer: {
    injectClient: (compilerConfig) => compilerConfig.name === 'only-include'
  }
};
```

## `devServer.injectHot`

`boolean: false` `function (compilerConfig) => boolean`

Tells `devServer` to inject a Hot Module Replacement. Setting `devServer.injectHot` to `true` will always inject. It is possible to provide a function to inject conditionally:

```javascript
module.exports = {
  //...
  devServer: {
    hot: true,
    injectHot: (compilerConfig) => compilerConfig.name === 'only-include'
  }
};
```

W> Make sure that [`devServer.hot`](#devserverhot) is set to `true`; `devServer.injectHot` only works with HMR.

## `devServer.inline`

`boolean`

Toggle between the dev-server's two different modes. By default, the application will be served with __inline mode__: a script will be inserted in your bundle to take care of live reloading, and build messages will appear in the browser console.

It is also possible to use __iframe mode__, which uses an `<iframe>` under a notification bar with messages about the build. To switch to iframe mode:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    inline: false
  }
};
```

Usage via the CLI:

```bash
webpack-dev-server --inline=false
```

T> Inline mode is recommended for [Hot Module Replacement](/plugins/hot-module-replacement-plugin/) as it includes an HMR trigger from the websocket. Polling mode is an alternative, but requires an additional entry point: `'webpack/hot/poll?1000'`.

## `devServer.lazy` 🔑

`boolean`

When `devServer.lazy` is enabled, the dev-server will only compile the bundle when it gets an HTTP request. This means that webpack will not watch for any file changes. We call this __lazy mode__.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    lazy: true
  }
};
```

Usage via the CLI:

```bash
webpack-dev-server --lazy
```

T> [`watchOptions`](#devserverwatchoptions-) will have no effect when used with __lazy mode__.

T> If you use the CLI, make sure that __inline mode__ is disabled.

## `devServer.liveReload`

`boolean = true`

By default, the dev-server will refresh the page when file changes are detected. Either the [`devServer.hot`](#devserverhot) option must be disabled or the [`devServer.watchContentBase`](#devserverwatchcontentbase) option must be enabled for `liveReload` to work.

Disable `devServer.liveReload` by setting it to `false`:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    liveReload: false
  }
};
```

Usage via the CLI:

```bash
webpack-dev-server --no-live-reload
```

## `devServer.mimeTypes` 🔑

`object`

Registers custom MIME types for an array of file extensions. For example, you could use this option to ensure the correct type of `application/webmanifest+json` is used when serving a [Web App Manifest](`webpack-dev-middleware`).

The object is passed to the underlying `webpack-dev-middleware`. See [`webpack-dev-middleware`’s documentation](https://github.com/webpack/webpack-dev-middleware#mimetypes) for usage notes.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    mimeTypes: { 'text/html': ['phtml'] }
  }
};
```

## `devServer.noInfo` 🔑

`boolean = false`

Tells dev-server to suppress messages like the webpack bundle information. Errors and warnings will still be shown. `devServer.noInfo` is disabled by default.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    noInfo: true
  }
};
```

## `devServer.onListening`

`function (server)`

Provides an option to execute a custom function when `webpack-dev-server` starts listening for connections on a port.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    onListening: function(server) {
      const port = server.listeningApp.address().port;
      console.log('Listening on port:', port);
    }
  }
};
```

## `devServer.open`

`boolean = false` `string`

Opens the browser after server had been started. Set it to `true` to open your default browser:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    open: true
  }
};
```

Provide a browser name to open it instead of your default one:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    open: 'Google Chrome'
  }
};
```

Usage via the CLI:

```bash
webpack-dev-server --open 'Google Chrome'
```

W> The browser application name is platform dependent. Don't hard code it in reusable modules. For example, Chrome is `'Google Chrome'` on macOS, `'google-chrome'` on Linux and `'chrome'` on Windows.

## `devServer.openPage`

`string` `[string]`

Specify a page to navigate to when opening the browser. Defaults to the index.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    openPage: '/different/page'
  }
};
```

Usage via the CLI:

```bash
webpack-dev-server --open-page "/different/page"
```

If you wish to specify multiple pages to open in the browser.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    openPage: ['/different/page1', '/different/page2']
  }
};
```

Usage via the CLI

```bash
webpack-dev-server --open-page "/different/page1,/different/page2"
```

## `devServer.overlay`

`boolean = false` `object: { errors boolean = false, warnings boolean = false }`

Shows a full-screen overlay in the browser when there are compiler errors or warnings. If you want to show only compiler errors:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    overlay: true
  }
};
```

If you want to show warnings as well as errors:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    }
  }
};
```

## `devServer.pfx`

`string`

When used via the CLI, a path to an SSL `.pfx` file. If used in options, it should be the bytestream of the `.pfx` file:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    pfx: '/path/to/file.pfx'
  }
};
```

Usage via the CLI:

```bash
webpack-dev-server --pfx /path/to/file.pfx
```

## `devServer.pfxPassphrase`

`string`

The passphrase to a SSL PFX file.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    pfxPassphrase: 'passphrase'
  }
};
```

Usage via the CLI:

```bash
webpack-dev-server --pfx-passphrase passphrase
```

## `devServer.port`

`number`

The port number that the dev server listens for requests on.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    port: 8080
  }
};
```

Usage via the CLI:

```bash
webpack-dev-server --port 8080
```

## `devServer.proxy`

`object` `[object, function]`

The dev-server makes use of the powerful [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) package. Check out [http-proxy-middleware’s documentation](https://github.com/chimurai/http-proxy-middleware#options) for more advanced usage.

T> Some of `http-proxy-middleware`'s features do not require a `target` key (e.g. its `router` feature), but you will still need to include a `target` key in your config here, or `webpack-dev-server` won't pass it along to `http-proxy-middleware`.

Proxying URLs can be useful if you have a separate API back-end development server and you want to send API requests on the same origin. With a backend on `localhost:3000`, you can use this to enable proxying:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
};
```

A request to `/api/users` will now proxy the request to `http://localhost:3000/api/users`.

If you don't want `/api` to be passed along, rewrite its path:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: {'^/api' : ''}
      }
    }
  }
};
```

A backend server running on HTTPS with an invalid certificate will not be accepted by default. If you want to access it anyway, modify your config like this:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': {
        target: 'https://other-server.example.com',
        secure: false
      }
    }
  }
};
```

Sometimes you don't want to proxy everything. It is possible to decide whether or not to proxy a request based on the return value of a function.

In the function you get access to the request, response and proxy options.

- Return `null` or `undefined` to continue processing the request with proxy.
- Return `false` to produce a 404 error for the request.
- Return a path to serve from, instead of continuing to proxy the request.

For example: for a browser’s request, you want to serve a HTML page, but for an API request you want to proxy it. You could do something like this:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        bypass: function(req, res, proxyOptions) {
          if (req.headers.accept.indexOf('html') !== -1) {
            console.log('Skipping proxy for browser request.');
            return '/index.html';
          }
        }
      }
    }
  }
};
```

If you want to proxy multiple specific paths to the same target, you can use an array of one or more objects with a `context` property:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    proxy: [{
      context: ['/auth', '/api'],
      target: 'http://localhost:3000',
    }]
  }
};
```

Note that requests to root won't be proxied by default. To enable root proxying, the `devServer.index` option should be specified as a falsy value:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    index: '', // specify to enable root proxying
    host: '...',
    contentBase: '...',
    proxy: {
      context: () => true,
      target: 'http://localhost:1234'
    }
  }
};
```

The origin of the host header is kept when proxying by default, but you can set `changeOrigin` to `true` to override this behaviour. It is useful in some cases like [name-based virtual hosted sites](https://en.wikipedia.org/wiki/Virtual_hosting#Name-based).

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
};
```

## `devServer.progress` — CLI only

`boolean`

Output running progress to the console.

```bash
webpack-dev-server --progress
```

## `devServer.public`

`string`

When using __inline mode__ and you're proxying dev-server, the inline client script does not always know where to connect to. It will try to guess the URL of the server based on `window.location`, but if that fails you'll need to use this.

For example, if the dev-server is proxied by nginx, and available on `myapp.test`:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    public: 'myapp.test:80'
  }
};
```

Usage via the CLI:

```bash
webpack-dev-server --public myapp.test:80
```

## `devServer.publicPath` 🔑

`string = '/'`

The bundled files will be available in the browser under this path.

Imagine that the server is running under `http://localhost:8080` and [`output.filename`](/configuration/output/#output-filename) is set to `bundle.js`. By default, the `devServer.publicPath` is `'/'`, so your bundle is available at `http://localhost:8080/bundle.js`.

Change `devServer.publicPath` to put the bundle under a specific directory:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    publicPath: '/assets/'
  }
};
```

The bundle will now be available at `http://localhost:8080/assets/bundle.js`.

T> Make sure `devServer.publicPath` always starts and ends with a forward slash (`/`).
  
It is also possible to use a full URL:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    publicPath: 'http://localhost:8080/assets/'
  }
};
```

The bundle will now be available at `http://localhost:8080/assets/bundle.js`.

T> It is recommended that `devServer.publicPath` is the same as [`output.publicPath`](/configuration/output/#outputpublicpath).

## `devServer.quiet` 🔑

`boolean`

With `devServer.quiet` enabled, nothing except the initial startup information will be written to the console. This also means that errors or warnings from webpack are not visible.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    quiet: true
  }
};
```

Usage via the CLI:

```bash
webpack-dev-server --quiet
```

## `devServer.serveIndex`

`boolean = true`

Tells dev-server to use [`serveIndex`](https://github.com/expressjs/serve-index) middleware when enabled.

The `serveIndex` middleware generates a listing of directory contents when viewing a directory that don't contain an `index.html` file.

```javascript
module.exports = {
  //...
  devServer: {
    serveIndex: true
  }
};
```

## `devServer.setup`

`function (app, server)`

W> This option is __deprecated__ in favor of [`devServer.before`](#devserver-before), and will be removed in v3.0.0.

Here you can access the Express app object and add your own custom middleware to it.
For example, to define custom handlers for some paths:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    setup: function(app, server) {
      app.get('/some/path', function(req, res) {
        res.json({ custom: 'response' });
      });
    }
  }
};
```

## `devServer.socket`

`string`

The Unix socket to listen to (instead of a hostname).

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    socket: 'socketname'
  }
};
```

Usage via the CLI:

```bash
webpack-dev-server --socket socketname
```

## `devServer.sockHost`

`string`

Tells clients connected to `devServer` to use the provided socket host.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    sockHost: 'myhost.test'
  }
};
```

## `devServer.sockPath`

`string = '/sockjs-node'`

The path where to connect to the reloading socket.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    sockPath: '/socket',
  }
};
```

Usage via the CLI:

```bash
webpack-dev-server --sockPath /socket
```

## `devServer.sockPort`

`number` `string`

Tells clients connected to `devServer` to use the provided socket port.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    sockPort: 8080
  }
};
```

## `devServer.staticOptions`

`object`

It is possible to configure advanced options for serving static files from `contentBase`. See the [Express documentation](http://expressjs.com/en/4x/api.html#express.static) for the possible options.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    staticOptions: {
      redirect: false
    }
  }
};
```

T> This only works when using [`devServer.contentBase`](#devservercontentbase) as a `string`.

## `devServer.stats` 🔑

`string: 'none' | 'errors-only' | 'minimal' | 'normal' | 'verbose'` `object`

Precisely controls what bundle information is displayed. This can be a nice middle ground if you want some bundle information, but not all of it.

To show only errors in your bundle:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    stats: 'errors-only'
  }
};
```

For more information, see the [`stats` documentation](/configuration/stats/).

T> This option has no effect when used with `quiet` or `noInfo`.

## `devServer.stdin` - CLI only

`boolean`

Closes the server when `stdin` ends.

```bash
webpack-dev-server --stdin
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
    transportMode: 'ws'
  }
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
      server: 'ws'
    }
  }
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
      server: require.resolve('./CustomServer')
    }
  }
};
```

Using class exported by `CustomServer.js`, a custom WebSocket server implementation, along with the compatible `'ws'` client:

```javascript
module.exports = {
  //...
  devServer: {
    transportMode: {
      client: 'ws',
      server: require('./CustomServer')
    }
  }
};
```

Using custom, compatible WebSocket client and server implementations:

```javascript
module.exports = {
  //...
  devServer: {
    transportMode: {
      client: require.resolve('./CustomClient'),
      server: require.resolve('./CustomServer')
    }
  }
};
```


## `devServer.useLocalIp`

`boolean`

This option lets the browser open with your local IP address.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    useLocalIp: true
  }
};
```

Usage via the CLI:

```bash
webpack-dev-server --useLocalIp
```

## `devServer.watchContentBase`

`boolean`

Tells dev-server to watch the files served by the [`devServer.contentBase`](#devserver-contentbase) option. Disabled by default. When enabled, file changes will trigger a full page reload.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    watchContentBase: true
  }
};
```

Usage via the CLI:

```bash
webpack-dev-server --watch-content-base
```

## `devServer.watchOptions` 🔑

`object`

Controls options related to watching the files.

webpack uses the file system to get notified of file changes. In some cases, this does not work. For example, when using Network File System or [Vagrant](https://www.vagrantup.com/). In these cases, use polling:

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    watchOptions: {
      poll: true
    }
  }
};
```

If this is too heavy on the file system, you can change this to an integer to set the polling interval in milliseconds.

See [WatchOptions](/configuration/watch/) for more options.

## `devServer.writeToDisk` 🔑

`boolean = false` `function (filePath) => boolean`

Tells `devServer` to write generated assets to the disk. The output is written to the [output.path](/configuration/output/#outputpath) directory.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    writeToDisk: true
  }
};
```

A provided `Function` can be used for filtering. The function follows the same premise as [`Array#filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), where a boolean return value determines if the file should be written to disk.

__webpack.config.js__

```javascript
module.exports = {
  //...
  devServer: {
    writeToDisk: (filePath) => {
      return /superman\.css$/.test(filePath);
    }
  }
};
```
