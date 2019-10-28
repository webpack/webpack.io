---
title: Integrations
sort: 23
contributors:
  - pksjce
  - bebraw
  - tashian
  - skipjack
  - AnayaDesign
  - fokusferit
---

Let's start by clearing up a common misconception. webpack is a module bundler like [Browserify](http://browserify.org/) or [Brunch](https://brunch.io/). It is _not a task runner_ like [Make](https://www.gnu.org/software/make/), [Grunt](https://gruntjs.com/), or [Gulp](https://gulpjs.com/). Task runners handle automation of common development tasks such as linting, building, or testing your project. Compared to bundlers, task runners have a higher level focus. You can still benefit from their higher level tooling while leaving the problem of bundling to webpack.

Bundlers help you get your JavaScript and stylesheets ready for deployment, transforming them into a format that's suitable for the browser. For example, JavaScript can be [minified](/plugins/terser-webpack-plugin) or [split into chunks](/guides/code-splitting) and [lazy-loaded](/guides/lazy-loading) to improve performance. Bundling is one of the most important challenges in web development, and solving it well can remove a lot of pain from the process.

The good news is that, while there is some overlap, task runners and bundlers can play well together if approached in the right way. This guide provides a high-level overview of how webpack can be integrated into some of the more popular task runners.


## NPM Scripts

Often webpack users use npm [`scripts`](https://docs.npmjs.com/misc/scripts) as their task runner. This is a good starting point. Cross-platform support can become a problem, but there are several workarounds for that. Many, if not most users, get by with only using npm `scripts` and various levels of webpack configuration and tooling.

So while webpack's core focus is bundling, there are a variety of extensions that can enable you to use it for jobs typical of a task runner. Integrating a separate tool adds complexity, so be sure to weigh the pros and cons before going forward.


## Grunt

For those using Grunt, we recommend the [`grunt-webpack`](https://www.npmjs.com/package/grunt-webpack) package. With `grunt-webpack` you can run webpack or [webpack-dev-server](https://github.com/webpack/webpack-dev-server) as a task, get access to stats within [template tags](https://gruntjs.com/api/grunt.template), split development and production configurations and more. Start by installing `grunt-webpack` as well as `webpack` itself if you haven't already:

``` bash
npm install --save-dev grunt-webpack webpack
```

Then register a configuration and load the task:

__Gruntfile.js__

``` js
const webpackConfig = require('./webpack.config.js');

module.exports = function(grunt) {
  grunt.initConfig({
    webpack: {
      options: {
        stats: !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
      },
      prod: webpackConfig,
      dev: Object.assign({ watch: true }, webpackConfig),
    },
  });

  grunt.loadNpmTasks('grunt-webpack');
};
```

For more information, please visit the [repository](https://github.com/webpack-contrib/grunt-webpack).


## Gulp

Gulp is also a fairly straightforward integration with the help of the [`webpack-stream`](https://github.com/shama/webpack-stream) package (a.k.a. `gulp-webpack`). In this case, it is unnecessary to install `webpack` separately as it is a direct dependency of `webpack-stream`:

``` bash
npm install --save-dev webpack-stream
```

Use `require('webpack-stream')` instead of `webpack` and optionally pass it an configuration:

__gulpfile.js__

``` js
const gulp = require('gulp');
const webpack = require('webpack-stream');
gulp.task('default', function() {
  return gulp.src('src/entry.js')
    .pipe(webpack({
      // Any configuration options...
    }))
    .pipe(gulp.dest('dist/'));
});
```

For more information, please visit the [repository](https://github.com/shama/webpack-stream).


## Mocha

The [`mocha-webpack`](https://github.com/zinserjan/mocha-webpack) utility can be used for a clean integration with Mocha. The repository offers more details on the pros and cons but essentially `mocha-webpack` is a wrapper that provides almost the same CLI as Mocha itself and provides various webpack functionality like an improved watch mode and improved path resolution. Here is a small example of how you would install it and use it to run a test suite (found within `./test`):

``` bash
npm install --save-dev webpack mocha mocha-webpack
mocha-webpack 'test/**/*.js'
```

For more information, please visit the [repository](https://github.com/zinserjan/mocha-webpack).


## Karma

The [`karma-webpack`](https://github.com/webpack-contrib/karma-webpack) package allows you to use webpack to pre-process files in [Karma](https://karma-runner.github.io/1.0/index.html). It also makes use of [`webpack-dev-middleware`](https://github.com/webpack/webpack-dev-middleware) and allows passing configurations for both. An example might look like this:

``` bash
npm install --save-dev webpack karma karma-webpack
```

__karma.conf.js__

``` js
module.exports = function(config) {
  config.set({
    files: [
      { pattern: 'test/*_test.js', watched: false },
      { pattern: 'test/**/*_test.js', watched: false },
    ],
    preprocessors: {
      'test/*_test.js': [ 'webpack' ],
      'test/**/*_test.js': [ 'webpack' ],
    },
    webpack: {
      // Any custom webpack configuration...
    },
    webpackMiddleware: {
      // Any custom webpack-dev-middleware configuration...
    },
  });
};
```

For more information, please visit the [repository](https://github.com/webpack-contrib/karma-webpack).
