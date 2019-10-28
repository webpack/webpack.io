---
title: Asset Management
sort: 2
contributors:
  - skipjack
  - michael-ciniawsky
  - TheDutchCoder
  - sudarsangp
  - chenxsan
  - EugeneHlushko
  - AnayaDesign
  - wizardofhogwarts
  - fokusferit
---

If you've been following the guides from the start, you will now have a small project that shows "Hello webpack". Now let's try to incorporate some other assets, like images, to see how they can be handled.

Prior to webpack, front-end developers would use tools like grunt and gulp to process these assets and move them from their `/src` folder into their `/dist` or `/build` directory. The same idea was used for JavaScript modules, but tools like webpack will __dynamically bundle__ all dependencies (creating what's known as a [dependency graph](/concepts/dependency-graph)). This is great because every module now _explicitly states its dependencies_ and we'll avoid bundling modules that aren't in use.

One of the coolest webpack features is that you can also _include any other type of file_, besides JavaScript, for which there is a loader. This means that the same benefits listed above for JavaScript (e.g. explicit dependencies) can be applied to everything used in building a website or web app. Let's start with CSS, as you may already be familiar with that setup.

## Setup

Let's make a minor change to our project before we get started:

__dist/index.html__

``` diff
  <!doctype html>
  <html>
    <head>
-    <title>Getting Started</title>
+    <title>Asset Management</title>
    </head>
    <body>
-     <script src="main.js"></script>
+     <script src="bundle.js"></script>
    </body>
  </html>
```

__webpack.config.js__

``` diff
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
-     filename: 'main.js',
+     filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
```


## Loading CSS

In order to `import` a CSS file from within a JavaScript module, you need to install and add the [style-loader](/loaders/style-loader) and [css-loader](/loaders/css-loader) to your [`module` configuration](/configuration/module):

``` bash
npm install --save-dev style-loader css-loader
```

__webpack.config.js__

``` diff
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
+   module: {
+     rules: [
+       {
+         test: /\.css$/,
+         use: [
+           'style-loader',
+           'css-loader',
+         ],
+       },
+     ],
+   },
  };
```

T> webpack uses a regular expression to determine which files it should look for and serve to a specific loader. In this case, any file that ends with `.css` will be served to the `style-loader` and the `css-loader`.

This enables you to `import './style.css'` into the file that depends on that styling. Now, when that module is run, a `<style>` tag with the stringified css will be inserted into the `<head>` of your html file.

Let's try it out by adding a new `style.css` file to our project and import it in our `index.js`:

__project__

``` diff
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
    |- bundle.js
    |- index.html
  |- /src
+   |- style.css
    |- index.js
  |- /node_modules
```

__src/style.css__

``` css
.hello {
  color: red;
}
```

__src/index.js__

``` diff
  import _ from 'lodash';
+ import './style.css';

  function component() {
    const element = document.createElement('div');

    // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+   element.classList.add('hello');

    return element;
  }

  document.body.appendChild(component());
```

Now run your build command:

``` bash
npm run build

...
    Asset      Size  Chunks             Chunk Names
bundle.js  76.4 KiB       0  [emitted]  main
Entrypoint main = bundle.js
...
```

Open up `index.html` in your browser again and you should see that `Hello webpack` is now styled in red. To see what webpack did, inspect the page (don't view the page source, as it won't show you the result, because the `<style>` tag is dynamically created by JavaScript) and look at the page's head tags. It should contain the style block that we imported in `index.js`.

Note that you can, and in most cases should, [minimize css](/plugins/mini-css-extract-plugin/#minimizing-for-production) for better load times in production. On top of that, loaders exist for pretty much any flavor of CSS you can think of -- [postcss](/loaders/postcss-loader), [sass](/loaders/sass-loader), and [less](/loaders/less-loader) to name a few.


## Loading Images

So now we're pulling in our CSS, but what about our images like backgrounds and icons? Using the [file-loader](/loaders/file-loader) we can incorporate those in our system as well:

``` bash
npm install --save-dev file-loader
```

__webpack.config.js__

``` diff
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ],
        },
+       {
+         test: /\.(png|svg|jpg|gif)$/,
+         use: [
+           'file-loader',
+         ],
+       },
      ],
    },
  };
```

Now, when you `import MyImage from './my-image.png'`, that image will be processed and added to your `output` directory _and_ the `MyImage` variable will contain the final url of that image after processing. When using the [css-loader](/loaders/css-loader), as shown above, a similar process will occur for `url('./my-image.png')` within your CSS. The loader will recognize this is a local file, and replace the `'./my-image.png'` path with the final path to the image in your `output` directory. The [html-loader](/loaders/html-loader) handles `<img src="./my-image.png" />` in the same manner.

Let's add an image to our project and see how this works, you can use any image you like:

__project__

``` diff
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
    |- bundle.js
    |- index.html
  |- /src
+   |- icon.png
    |- style.css
    |- index.js
  |- /node_modules
```

__src/index.js__

``` diff
  import _ from 'lodash';
  import './style.css';
+ import Icon from './icon.png';

  function component() {
    const element = document.createElement('div');

    // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');

+   // Add the image to our existing div.
+   const myIcon = new Image();
+   myIcon.src = Icon;
+
+   element.appendChild(myIcon);

    return element;
  }

  document.body.appendChild(component());
```

__src/style.css__

``` diff
  .hello {
    color: red;
+   background: url('./icon.png');
  }
```

Let's create a new build and open up the index.html file again:

``` bash
npm run build

...
                               Asset      Size  Chunks                    Chunk Names
da4574bb234ddc4bb47cbe1ca4b20303.png  3.01 MiB          [emitted]  [big]
                           bundle.js  76.7 KiB       0  [emitted]         main
Entrypoint main = bundle.js
...
```

If all went well, you should now see your icon as a repeating background, as well as an `img` element beside our `Hello webpack` text. If you inspect this element, you'll see that the actual filename has changed to something like `5c999da72346a995e7e2718865d019c8.png`. This means webpack found our file in the `src` folder and processed it!

T> A logical next step from here is minifying and optimizing your images. Check out the [image-webpack-loader](https://github.com/tcoopman/image-webpack-loader) and [url-loader](/loaders/url-loader) for more on how you can enhance your image loading process.


## Loading Fonts

So what about other assets like fonts? The file and url loaders will take any file you load through them and output it to your build directory. This means we can use them for any kind of file, including fonts. Let's update our `webpack.config.js` to handle font files:

__webpack.config.js__

``` diff
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader',
          ],
        },
+       {
+         test: /\.(woff|woff2|eot|ttf|otf)$/,
+         use: [
+           'file-loader',
+         ],
+       },
      ],
    },
  };
```

Add some font files to your project:

__project__


``` diff
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
    |- bundle.js
    |- index.html
  |- /src
+   |- my-font.woff
+   |- my-font.woff2
    |- icon.png
    |- style.css
    |- index.js
  |- /node_modules
```

With the loader configured and fonts in place, you can incorporate them via an `@font-face` declaration. The local `url(...)` directive will be picked up by webpack as it was with the image:

__src/style.css__

``` diff
+ @font-face {
+   font-family: 'MyFont';
+   src:  url('./my-font.woff2') format('woff2'),
+         url('./my-font.woff') format('woff');
+   font-weight: 600;
+   font-style: normal;
+ }

  .hello {
    color: red;
+   font-family: 'MyFont';
    background: url('./icon.png');
  }
```

Now run a new build and let's see if webpack handled our fonts:

``` bash
npm run build

...
                                 Asset      Size  Chunks                    Chunk Names
5439466351d432b73fdb518c6ae9654a.woff2  19.5 KiB          [emitted]
 387c65cc923ad19790469cfb5b7cb583.woff  23.4 KiB          [emitted]
  da4574bb234ddc4bb47cbe1ca4b20303.png  3.01 MiB          [emitted]  [big]
                             bundle.js    77 KiB       0  [emitted]         main
Entrypoint main = bundle.js
...
```

Open up `index.html` again and see if our `Hello webpack` text has changed to the new font. If all is well, you should see the changes.


## Loading Data

Another useful asset that can be loaded is data, like JSON files, CSVs, TSVs, and XML. Support for JSON is actually built-in, similar to NodeJS, meaning `import Data from './data.json'` will work by default. To import CSVs, TSVs, and XML you could use the [csv-loader](https://github.com/theplatapi/csv-loader) and [xml-loader](https://github.com/gisikw/xml-loader). Let's handle loading all three:

``` bash
npm install --save-dev csv-loader xml-loader
```

__webpack.config.js__

``` diff
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader',
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            'file-loader',
          ],
        },
+       {
+         test: /\.(csv|tsv)$/,
+         use: [
+           'csv-loader',
+         ],
+       },
+       {
+         test: /\.xml$/,
+         use: [
+           'xml-loader',
+         ],
+       },
      ],
    },
  };
```

Add some data files to your project:

__project__

``` diff
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
    |- bundle.js
    |- index.html
  |- /src
+   |- data.xml
    |- my-font.woff
    |- my-font.woff2
    |- icon.png
    |- style.css
    |- index.js
  |- /node_modules
```

__src/data.xml__

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<note>
  <to>Mary</to>
  <from>John</from>
  <heading>Reminder</heading>
  <body>Call Cindy on Tuesday</body>
</note>
```

Now you can `import` any one of those four types of data (JSON, CSV, TSV, XML) and the `Data` variable you import it to will contain parsed JSON for consumption:

__src/index.js__

``` diff
  import _ from 'lodash';
  import './style.css';
  import Icon from './icon.png';
+ import Data from './data.xml';

  function component() {
    const element = document.createElement('div');

    // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');

    // Add the image to our existing div.
    const myIcon = new Image();
    myIcon.src = Icon;

    element.appendChild(myIcon);

+   console.log(Data);

    return element;
  }

  document.body.appendChild(component());
```

Re-run the `npm run build` command and open `index.html`. If you look at the console in your developer tools, you should be able to see your imported data being logged to the console!

T> This can be especially helpful when implementing some sort of data visualization using a tool like [d3](https://github.com/d3). Instead of making an ajax request and parsing the data at runtime you can load it into your module during the build process so that the parsed data is ready to go as soon as the module hits the browser.


## Global Assets

The coolest part of everything mentioned above is that loading assets this way allows you to group modules and assets together in a more intuitive way. Instead of relying on a global `/assets` directory that contains everything, you can group assets with the code that uses them. For example, a structure like this can be very useful:

``` diff
- |- /assets
+ |– /components
+ |  |– /my-component
+ |  |  |– index.jsx
+ |  |  |– index.css
+ |  |  |– icon.svg
+ |  |  |– img.png
```

This setup makes your code a lot more portable as everything that is closely coupled now lives together. Let's say you want to use `/my-component` in another project, copy or move it into the `/components` directory over there. As long as you've installed any _external dependencies_ and your _configuration has the same loaders_ defined, you should be good to go.

However, let's say you're locked into your old ways or you have some assets that are shared between multiple components (views, templates, modules, etc.). It's still possible to store these assets in a base directory and even use [aliasing](/configuration/resolve/#resolvealias) to make them easier to `import`.


## Wrapping up

For the next guides we won't be using all the different assets we've used in this guide, so let's do some cleanup so we're prepared for the next piece of the guides [Output Management](https://webpack.js.org/guides/output-management/):

__project__

``` diff
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
    |- bundle.js
    |- index.html
  |- /src
-   |- data.xml
-   |- my-font.woff
-   |- my-font.woff2
-   |- icon.png
-   |- style.css
    |- index.js
  |- /node_modules
```

__webpack.config.js__

``` diff
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
-   module: {
-     rules: [
-       {
-         test: /\.css$/,
-         use: [
-           'style-loader',
-           'css-loader',
-         ],
-       },
-       {
-         test: /\.(png|svg|jpg|gif)$/,
-         use: [
-           'file-loader',
-         ],
-       },
-       {
-         test: /\.(woff|woff2|eot|ttf|otf)$/,
-         use: [
-           'file-loader',
-         ],
-       },
-       {
-         test: /\.(csv|tsv)$/,
-         use: [
-           'csv-loader',
-         ],
-       },
-       {
-         test: /\.xml$/,
-         use: [
-           'xml-loader',
-         ],
-       },
-     ],
-   },
  };
```

__src/index.js__

``` diff
  import _ from 'lodash';
- import './style.css';
- import Icon from './icon.png';
- import Data from './data.xml';
-
  function component() {
    const element = document.createElement('div');
-
-   // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
-   element.classList.add('hello');
-
-   // Add the image to our existing div.
-   const myIcon = new Image();
-   myIcon.src = Icon;
-
-   element.appendChild(myIcon);
-
-   console.log(Data);

    return element;
  }

  document.body.appendChild(component());
```


## Next guide

Let's move on to [Output Management](https://webpack.js.org/guides/output-management/)


## Further Reading

- [Loading Fonts](https://survivejs.com/webpack/loading/fonts/) on SurviveJS
