---
title: Minimal Startup
sort: 2
contributors:
  - msheliga1
---

This tutorial uses NPM, webpack and JavaScript to teach basic webpack.
The webpack command is used to bundle and convert, or transpile, JavaScript modules.

A minimal webpack example is first demonstrated. Progressively
more complex webpack features are introduced including:
- examining webpacked files
- using named output files
- using development mode
- using standard src and dist folders
- packing multiple files

## Part I. Minimal Webpack Example
### A. Installation

Before running webpack it must be installed. This is almost always done using NPM. Hence NPM must be installed. This is normally done by installing Node.js which includes NPM by default. While full NPM details are not supported in this tutorial, it can be downloaded and installed at https://nodejs.org/. Once installed, reboot and verify that npm has been installed using "npm -v" which prints the version number (currently 5.6.0).

Now create a new directory, change into it and use npm to install both webpack and webpack-cli (webpack's command line interface tool) globally.

``` bash
mkdir webpack-basics
cd webpack-basics
npm install webpack webpack-cli --global
```

### B. Minimal Webpack Command - webpack <entryFilename.js>

The simpliest webpack command in the current version of webpack is "webpack <entryFilename.js>". Before issuing this command the <entryFilename.js> file must be created. This file will be named entryMain.js in this case.

__webpack-basics/entryMain.js__
``` JavaScript
  console.log('Console.log message inside entryMain.js')
```

Now we can webpack this file.

``` bash
> webpack entryMain.js

Hash: ae8ebe3170f4c6373946
Version: webpack 4.17.1
Time: 1660ms
Built at: 2018-08-25 11:31:33
  Asset       Size  Chunks             Chunk Names
main.js  984 bytes       0  [emitted]  main
Entrypoint main = main.js
[0] ./entryMain.js 56 bytes {0} [built]

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/concepts/mode/
```

Congratulations, you have webpacked your first file!!!

#### Confirm that webpack worked.

First ignore the warning about the mode option for now. Next confirm the following new directory structure.

__project__
``` diff
  webpack-basics
+ |- dist
+   |- main.js
  |- entryMain.js
```

Note that a dist folder has been created inside your project folder. Change into it and confirm that a main.js file has been created. The dist folder is the default location for the bundled file and webpack created it automatically since it did not exist. Similarly webpack "bundled: the entryMain.js file into a main.js file.  This can be seen in the output line: Entrypoint main = main.js.

Open the bundled main.js file and observe that it consists of JavaScript code without line breaks. Much of the code will be unfamiliar, but you should be able to find the content of your entryMain.js file inside the main.js file at the end of the file.

__webpack-basics/dist/main.js__
``` JavaScript
!function(e){var n={};function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(r,o,function(n){return e[n]}.bind(null,o));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=0)}([function(e,n){console.log("Console.log message inside entryMain.js")}]);
```

### C. Using a bundled webpacked file.
-----------------------------
The simplest and most common way to use a bundled webpacked file is to create an html file named index.html, main.html or similar and include the bundled file in a script tag. This is the traditional way to include JavaScript files in html pages, but in this case only one "bundled" filed needs to be included. In this case a file named indexMain.html should be created.

__webpack-basics/indexMain.html__
``` html
<!DOCTYPE html>
<html>
  <body>
    Webpack indexMain.html Body Text (With only: script src='./dist/main.js').
    <br> <script src='./dist/main.js'></script>
  </body>
</html>
```

__project__
``` diff
  webpack-basics
  |- dist
    |- main.js
  |- entryMain.js
+ |- indexMain.html
```

Notice that the above file uses the "dist/main.js" file created by webpack. Such a file is referred to as a bundled file since it consists of one or more JavaScript files bundled together by webpack.  

You should now be able to load your indexMain.html file into a browser. In our case we entered
file:///C:/Users/Mike/Desktop/js/webpack-basics/indexMain.html in a chrome browser. You will, of course, need to substitute your pathname for the above. The expected output of: "Webpack indexMain.html Body Text (With only: script src='./dist/main.js').", should be displayed.  This is the text found in indexMain.html. Use chrome developer tools (f12) or another tool to bring up a console window.  You should see the message from the entryMain.js file: "Console.log message inside entryMain.js".

__indexMain.html Browser Display__
``` bash
Webpack indexMain.html Body Text (With only: script src='./dist/main.js').
```

### Why Not Use the Original File?

Why do we use this "bundled" file when the original entryMain.js file could have been used instead?  Great Question!  In a real world application you will likely have hundreds of JavaScript files with complex dependencies.  Webpack will help keep track of these dependencies, ensure they are used in the correct order and bundle all the JavaScript files together into a single file. In this minimal example we only bundled one file named entryMain.js, but in a production application webpack can efficiently handle hundred of files.

Additionally webpack has features, known as loaders and plug-ins, that allow advanced features to be used in JavaScript files and still have these files run on older software. Loaders and plug-ins are not part of this basic tutorial but may be found on the webpack website.  

## Part II. Webpack Command Enhancements
##### Development Mode, Named Output and Standard Directory Structure

### A. Eliminating the Mode Warning
When the entryMain file was bundled a warning message about the mode being undefined was generated.

``` bash
WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more:
 https://webpack.js.org/concepts/mode
```

We wish to get rid of this "nag" warning.  As noted in the warning there are 3 modes: production, development and none.  Development mode best suits our needs so add --mode development to the webpack command.

``` bash
> webpack entryMain.js --mode development

Hash: ae8ebe3170f4c6373946
Version: webpack 4.17.1
Time: 1660ms
Built at: 2018-08-25 11:31:33
  Asset       Size  Chunks             Chunk Names
main.js  984 bytes       0  [emitted]  main
Entrypoint main = main.js
[0] ./entryMain.js 56 bytes {0} [built]
```

#### Advantages of Development Mode
Open the dist/main.js file. You should see that the file is the same as before except that the text has line breaks. This is one of the advantages of using development mode. It includes a much more readable bundled file for developers. Development mode is also optimized for speed during bundling while production mode is optimized for speed while running the resulting bundled main.js file.

__webpack-basics/dist/main.js__
``` JavaScript
...
...
  !*** ./entryMain.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("console.log('Console.log message inside entryMain.js')\r\n\n\n//# sourceURL=webpack:///./entryMain.js?");

/***/ })

/******/ });
```

### B. Changing the Bundled Filename and Location
So far our output has been automatically generated in dist/main.js. This can be changed using the --output <outputFileName> or -o <outputFileName> options. Note the double dash in --output, but the single dash in -o.  This is a common convention.  Full names for options tend to be preceded by a double dash while abbreviated names tend to be preceded by a single dash. As a similar example "npm install <filename> --global" is equivalent to "npm install <filename> -g".  

From now on we will name our webpacked bundle file "bundle.js". This is a common convention and helps to distinguish this file from the default main.js file.

``` bash
> webpack entryMain.js --output bundle.js --mode development

Hash: 4d7ae35e6c4f293c82be
Version: webpack 4.16.5
Time: 266ms
Built at: 2018-08-25 23:06:41
    Asset      Size  Chunks             Chunk Names
bundle.js  3.83 KiB    main  [emitted]  main
Entrypoint main = bundle.js
[./entryMain.js] 56 bytes {main} [built]
```

You should see output confirming the bundle.js file was created. Examine it and confirm that it contains the correct bundled JavaScript. Note, however, that bundle.js is in the webpack-basics directory.

__project__
``` diff
  webpack-basics
  |- dist
    |- main.js
  |- entryMain.js
  |- indexMain.html
+ |- bundle.js
```

This is not where a bundled should be kept. As with the default main.js file, and as discussed further below, the bundled webpack files are kept in the dist folder. Delete the current bundle.js file and generate a new bundle.js file in the dist directory by changing the output option to dist/bundle.js.

``` bash
> webpack entryMain.js -o dist/bundle.js --mode development

Hash: 4d7ae35e6c4f293c82be
Version: webpack 4.16.5
Time: 266ms
Built at: 2018-08-25 23:06:41
    Asset      Size  Chunks             Chunk Names
bundle.js  3.83 KiB    main  [emitted]  main
Entrypoint main = bundle.js
[./entryMain.js] 56 bytes {main} [built]
```

Note that for learning purposes we used -o here instead of --output. They are equivalent.  The bundle.js file should now be in the dist folder. It may be examined to confirm that it is the same as before.

__project__
``` diff
  webpack-basics
  |- dist
    |- main.js
+   |- bundle.js
  |- entryMain.js
  |- indexMain.html
```

Finally note that "webpack <entryfilename> <outputfilename>" (without --output or -o) will not work with the current version of webpack (per some older tutorials this worked with older version of webpack).

### C. Typical Project Structure - src and dist folders

It's time for a little bookkeeping. There are now two bundled files, main.js and bundle.js.  While we could include the bundle.js file in the current indexMain.html file we wish to keep the previously generated "main" files distinct from the newer files. Often the index files are kept in the root directory of the project while the various JavaScript files such as entry.js are kept in a source directory named "src". This comes in very handy as we create more and more JavaScript files that depend upon each other.

Copy indexMain.html to indexBundle.html. Create a src folder and copy entryMain.js to src/entryBundle.js. (We'll leave entryMain.js where it is for reference purposes.) From now on we will work with the indexBundle.html, src/entryBundle.js files but leave the "main" files as they are in case you need to refer to them.

__project__
``` diff
  webpack-basics
  |- indexMain.html
  |- entryMain.js
+ |- indexBundle.html
+ |- src
+   |- entryBundle.js
  |- dist
    |- main.js
    |- bundle.js
```

After copying the files we will need to edit indexBundle.html to point to the new bundled file, dist/bundle.js. It's text should also be updated to reflect it is indexBundle.html instead of indexMain.html. Similarly modify the console.log message in entryBundle.js.

__webpack-basics/indexBasics.html__
``` html
<!DOCTYPE html>
<html>
  <body>
    Webpack indexBundle.html Body Text (With only: script src='./dist/bundle.js').
    <br> <script src='./dist/bundle.js'></script>
  </body>
</html>
```

__webpack-basics/src/entryBundle.js__
``` JavaScript
  console.log('Console.log message inside entryBundle.js')
```


Now rerun webpack.

``` bash
> webpack src/entryBundle.js -o dist/bundle.js --mode development

Hash: ae8ebe3170f4c6373946
Version: webpack 4.17.1
Time: 1660ms
Built at: 2018-08-25 11:31:33
  Asset       Size  Chunks             Chunk Names
bundle.js  984 bytes       0  [emitted]  main
Entrypoint main = bundle.js
[0] ./entryMain.js 56 bytes {0} [built]
```   

Change your browser URL to ...webpack-basics/indexBundle.html and you should now be able to see the updated text inside indexBundle.html as well as the updated console message from entryBundle.js.

## Part III. Webpacking Multiple Files
Webpack automatically "sucks in" and bundles multiple JavaScript files as needed.  The simplest way to do this is to use a require statement, such as require('two.js'). Webpack begins by bundling the entry JavaScript file found in the webpack command.  It then processes and bundles the required files found in this file and repeats.  In this manner all required file(s) are automatically bundled and correctly ordered along with the entry file.

Copy entryBundle.js to entry.js and indexBundle.html to index.hmtl. Edit index.html to include div tags with text. The text inside the div tags will be updated in the JavaScript files using document.getElementById("xx").innerText = "text from .js file".

__webpack-basics/index.html__
``` html
<!DOCTYPE html>
<html>
	<body>
		<br> <div> Webpack index.html Body Text with 3 Divs </div>
		<br> <div id="d1">Para1 set in index.html</div>
		<br> <div id="d2">Para2 set in index.html</div>
		<br> <div id="d3">Para3 set in index.html</div>
		<br> <script src='./dist/bundle.js'></script>
	</body>
</html>
```

 Edit entry.js to include require statements and update the first div.

__webpack-basics/src/entry.js__
``` JavaScript
require('./two.js')
require('./three.js')
console.log('Console message from entry.js')
document.getElementById('d1').innerText='d1 set by entry.js'
```

Create two.js and thee.js in the src folder.  Edit them to include a console.log and an update of the divs.

__webpack-basics/src/two.js__
``` JavaScript
console.log('Console message from two.js')
document.getElementById('d2').innerText='d2 set by two.js'
```

__webpack-basics/src/three.js__
``` JavaScript
console.log('Console message from three.js')
document.getElementById('d3').innerText='d3 set by three.js'
```


### Webpack the files
Since webpack automatically "sucks in" required files the webpack command still only needs to point to the entry file.

``` bash
> webpack src/entry.js -o dist/bundle.js --mode development
Hash: 78495fdc7801a01bf6df
Version: webpack 4.16.5
Time: 315ms
Built at: 2018-08-26 11:01:44
    Asset      Size  Chunks             Chunk Names
bundle.js  4.67 KiB    main  [emitted]  main
Entrypoint main = bundle.js
[./src/entry.js] 152 bytes {main} [built]
[./src/three.js] 101 bytes {main} [built]
[./src/two.js] 95 bytes {main} [built]
```
Notice that files two.js and three.js have been bundled along with the entry file.

Take a look at the resulting bundle.js file. It may be opened with notepad or another text editor. You should be able to search through it and find the JavaScript commands from your original entry.js, two.js and three.js files.

__webpack-basics/dist/bundle.js__
``` JavaScript
...
...
/***/ (function(module, exports) {

eval("console.log('Console msg by two.js')\r\ndocument.getElementById('d1').innerText='Set by two.js'\r\n\n\n//# sourceURL=webpack:///./src/two.js?");

/***/ })

/******/ });
```

Next open the index.html file in a browser. You should see that the divs from index.hmtl were updated by the entry.js, two.js and three.js files.  You should also be able to find the console.log messages in your development tools (F12) console.

__indexMain.html Browser Display__
``` bash
Webpack index.html Body Text with 3 Divs

d1 set by entry.js

Set by two.js

Set by three.js
```

## Part IV. Future Considerations

### A. Other Features
We have just scratched the surface of webpack. There are many other options and tricks including:
- Use webpack.config.js to control the entry and output files.
- Include modern JavaScript ES6 features such as "let" and "import".
- Use a css style file.
- Use loaders.  These are needed when using ES6, css and a host of other features.
- Use plug-ins.  These are similar to loaders but for more complex situations.
- Have webpack "watch" for changes to any of the input javascript files and automatically regenerate the bundled file whenever one changes.

### B. Caveats
This tutorial was designed to demonstrate the easiest webpack commands. Several shortcuts were used that should not be used in production work.
- NPM and it's package.json file are almost always used in tight conjunction with webpack.
- webpack is often run using NPM scripts instead of from the command line.
- webpack is not installed globally.  Instead it is installed and run locally.
