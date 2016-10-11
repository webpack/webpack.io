var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var Autoprefixer = require('autoprefixer');
var merge = require('webpack-merge');
var webpack = require('webpack');

<<<<<<< HEAD
var cwd = process.cwd();
var stylePaths = [
  path.join(cwd, 'styles'),
  path.join(cwd, 'components'),
  path.join(cwd, 'node_modules/highlight.js/styles', 'github-gist.css')
];

const commonConfig = {
  entry: {
    style: [
      path.join(cwd, 'styles', 'index.scss')
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel!eslint',
        include: [
          path.join(__dirname, 'components')
        ]
      },
      {
        test: /\.woff$/,
        loaders: ['url?prefix=font/&limit=5000&mimetype=application/font-woff']
      },
      {
        test: /\.ttf$|\.eot$/,
        loaders: ['file?prefix=font/']
      },
      {
        test: /\.jpg$/,
        loaders: ['file']
      },
      {
        test: /\.png$/,
        loaders: ['file']
      },
      {
        test: /\.svg$/,
        loaders: ['raw']
      },
      {
        test: /\.html$/,
        loaders: ['raw']
      },
      {
        test: /\.md$/,
        include:[
          path.join(__dirname, 'snippets')
        ],
        loader: 'html-loader!highlight-loader!markdown-loader'
      }
    ]
  },
  eslint: {
    fix: true,
    configFile: require.resolve('./.eslintrc')
  },
  postcss: function() {
    return [ Autoprefixer ];
  },
  sassLoader: {
    includePaths: [ path.join('./styles/partials') ]
  }
};

const interactiveConfig = {
  resolve: {
    alias: {
      react: 'preact-compat',
      'react-dom': 'preact-compat'
    }
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};

const developmentConfig = {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
        include: stylePaths
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'postcss', 'sass'],
        include: stylePaths
      }
    ]
  }
};
=======
module.exports = function(env) {
  var cwd = process.cwd();
  var stylePaths = [
    path.join(cwd, 'styles', 'reset.css'),
    path.join(cwd, 'styles', 'icons.css'),
    path.join(cwd, 'styles', 'index.scss'),
    path.join(cwd, 'node_modules/highlight.js/styles', 'github-gist.css')
  ];
>>>>>>> Adds github-gist highlight

const buildConfig = {
  output: {
    publicPath: '/assets/'
  },
  plugins: [
    new ExtractTextPlugin('[name].css', {
      allChunks: true
    })
  ],
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css'
        ),
        include: stylePaths
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css!postcss!sass'
        ),
        include: stylePaths
      }
    ]
  }
};

module.exports = function(env) {
  switch(env) {
    case 'start':
      return merge(
        commonConfig,
        developmentConfig
      );
    case 'interactive':
      return merge(
        commonConfig,
        buildConfig,
        interactiveConfig
      );
    case 'build':
      return merge(
        commonConfig,
        buildConfig
      );
  }
};
