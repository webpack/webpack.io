---
title: Progressive Web Application
sort: 21
contributors:
  - johnnyreilly
  - chenxsan
  - EugeneHlushko
  - benschac
  - aholzner
---

T> This guide extends on code examples found in the [Output Management](/guides/output-management) guide.

Progressive Web Applications (or PWAs) are web apps that deliver an experience similar to native applications. There are many things that can contribute to that. Of these, the most significant is the ability for an app to be able to function when __offline__. This is achieved through the use of a web technology called [Service Workers](https://developers.google.com/web/fundamentals/primers/service-workers/).

This section will focus on adding an offline experience to our app. We'll achieve this using a Google project called [Workbox](https://github.com/GoogleChrome/workbox) which provides tools that help make offline support for web apps easier to setup.


## We Don't Work Offline Now

So far, we've been viewing the output by going directly to the local file system. Typically though, a real user accesses a web app over a network; their browser talking to a __server__ which will serve up the required assets (e.g. `.html`, `.js`, and `.css` files).

So let's test what the current experience is when using a generic http server. Let's use the [http-server](https://www.npmjs.com/package/http-server) package: `npm install http-server --save-dev`. We'll also amend the `scripts` section of our `package.json` to add in a `start` script:

__package.json__

``` diff
{
  ...
  "scripts": {
-    "build": "webpack"
+    "build": "webpack",
+    "start": "http-server dist"
  },
  ...
}
```

Note: [webpack DevServer](/configuration/dev-server/) writes in-memory by default. We'll need to enable [writeToDisk](/configuration/dev-server/#devserverwritetodisk-) option in order for http-server to be able to serve files from `./dist` directory.

If you haven't previously done so, run the command `npm run build` to build your project. Then run the command `npm start`. This should produce the following output:

``` bash
> http-server dist

Starting up http-server, serving dist
Available on:
  http://xx.x.x.x:8080
  http://127.0.0.1:8080
  http://xxx.xxx.x.x:8080
Hit CTRL-C to stop the server
```

If you open your browser to `http://localhost:8080` (i.e. `http://127.0.0.1`) you should see your webpack application being served from the `dist` directory. If you stop the server and refresh, the webpack application is no longer available.

This is what we aim to change. Once we reach the end of this module we should be able to stop the server, hit refresh and still see our application.


## Adding Workbox

Let's add the Workbox webpack plugin and adjust the `webpack.config.js` file:

``` bash
npm install workbox-webpack-plugin --save-dev
```

__webpack.config.js__

``` diff
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const { CleanWebpackPlugin } = require('clean-webpack-plugin');
+ const WorkboxPlugin = require('workbox-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js',
    },
    plugins: [
      // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
-       title: 'Output Management',
+       title: 'Progressive Web Application',
      }),
+     new WorkboxPlugin.GenerateSW({
+       // these options encourage the ServiceWorkers to get in there fast
+       // and not allow any straggling "old" SWs to hang around
+       clientsClaim: true,
+       skipWaiting: true,
+     }),
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
```

With that in place, let's see what happens when we do an `npm run build`:

``` bash
...
                  Asset       Size  Chunks                    Chunk Names
          app.bundle.js     545 kB    0, 1  [emitted]  [big]  app
        print.bundle.js    2.74 kB       1  [emitted]         print
             index.html  254 bytes          [emitted]
precache-manifest.b5ca1c555e832d6fbf9462efd29d27eb.js  268 bytes          [emitted]
      service-worker.js       1 kB          [emitted]
...
```

As you can see, we now have 2 extra files being generated; `service-worker.js` and the more verbose `precache-manifest.b5ca1c555e832d6fbf9462efd29d27eb.js`. `service-worker.js` is the Service Worker file and `precache-manifest.b5ca1c555e832d6fbf9462efd29d27eb.js` is a file that `service-worker.js` requires so it can run. Your own generated files will likely be different; but you should have an `service-worker.js` file there.

So we're now at the happy point of having produced a Service Worker. What's next?


## Registering Our Service Worker

Let's allow our Service Worker to come out and play by registering it. We'll do that by adding the registration code below:

__index.js__

``` diff
  import _ from 'lodash';
  import printMe from './print.js';

+ if ('serviceWorker' in navigator) {
+   window.addEventListener('load', () => {
+     navigator.serviceWorker.register('/service-worker.js').then(registration => {
+       console.log('SW registered: ', registration);
+     }).catch(registrationError => {
+       console.log('SW registration failed: ', registrationError);
+     });
+   });
+ }
```

Once more `npm run build` to build a version of the app including the registration code. Then serve it with `npm start`. Navigate to `http://localhost:8080` and take a look at the console. Somewhere in there you should see:

``` bash
SW registered
```

Now to test it. Stop your server and refresh your page. If your browser supports Service Workers then you should still be looking at your application. However, it has been served up by your Service Worker and __not__ by the server.


## Conclusion

You have built an offline app using the Workbox project. You've started the journey of turning your web app into a PWA. You may now want to think about taking things further. A good resource to help you with that can be found [here](https://developers.google.com/web/progressive-web-apps/).
