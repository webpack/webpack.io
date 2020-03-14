// Import External Dependencies
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const merge = require('webpack-merge');
const SSGPlugin = require('static-site-generator-webpack-plugin');
const RedirectWebpackPlugin = require('redirect-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const flattenContentTree = require('./src/utilities/flatten-content-tree');
const contentTree = require('./src/_content.json');

// Load Common Configuration
const common = require('./webpack.common.js');

// content tree to path array
const paths = [
  ...flattenContentTree(contentTree),
  '/vote',
  '/organization',
  '/starter-kits',
  '/app-shell'
];

module.exports = env => merge(common(env), {
    mode: 'production',
    target: 'node',
    entry: {
      index: './server.jsx'
    },
    output: {
      filename: 'server.[name].js',
      libraryTarget: 'umd'
    },
    optimization: {
        splitChunks: false
    },
    plugins: [
      new SSGPlugin({
        globals: {
          window: {
            __ssgrun: true
          }
        },
        paths,
        locals: {
          content: contentTree
        }
      }),
      new RedirectWebpackPlugin({
        redirects: {
          'support': '/contribute/',
          'writers-guide': '/contribute/writers-guide/',
          'get-started': '/guides/getting-started/',
          'get-started/install-webpack': '/guides/installation/',
          'get-started/why-webpack': '/guides/why-webpack/',
          'pluginsapi': '/api/plugins/',
          'pluginsapi/compiler': '/api/compiler-hooks/',
          'pluginsapi/template': '/api/template/',
          'api/passing-a-config': '/configuration/configuration-types/',
          'api/plugins/compiler': '/api/compiler-hooks/',
          'api/plugins/compilation': '/api/compilation/',
          'api/plugins/module-factories': '/api/module-methods/',
          'api/plugins/parser': '/api/parser/',
          'api/plugins/tapable': '/api/tapable/',
          'api/plugins/template': '/api/template/',
          'api/plugins/resolver': '/api/resolver/',
          'development': '/contribute/',
          'development/plugin-patterns': '/contribute/plugin-patterns/',
          'development/release-process': '/contribute/release-process/',
          'development/how-to-write-a-loader': '/contribute/writing-a-loader/',
          'development/how-to-write-a-plugin': '/contribute/writing-a-plugin/',
          'guides/code-splitting-import': '/guides/code-splitting/',
          'guides/code-splitting-require': '/guides/code-splitting/',
          'guides/code-splitting-async': '/guides/code-splitting/',
          'guides/code-splitting-css': '/guides/code-splitting/',
          'guides/code-splitting-libraries': '/guides/code-splitting/',
          'guides/why-webpack': '/comparison/',
          'guides/production-build': '/guides/production/',
          'migrating': '/migrate/3/',
          'plugins/no-emit-on-errors-plugin': '/configuration/optimization/#optimizationnoemitonerrors',
          'concepts/mode': '/configuration/mode'
        }
      }),
      new CopyWebpackPlugin([
        {
          from: './assets/icon-square-small-slack.png',
          to: './assets/'
        },
        {
          from: './assets/icon-square-big.svg',
          to: './assets/'
        },
        {
          from: './assets/robots.txt',
          to: './'
        },
        'CNAME'
      ]),
      new WebpackPwaManifest({
        name: 'webpack Documentation',
        short_name: 'webpack',
        description: 'webpack documentation web application',
        background_color: '#2b3a42',
        theme_color: '#2b3a42',
        display: 'fullscreen',
        inject: false,
        fingerprints: false,
        ios: true,
        scope: '/',
        start_url: '/',
        orientation: 'omit',
        icons: [
          {
            src: path.resolve('src/assets/icon-pwa-512x512.png'),
            sizes: [72, 96, 128, 144, 150, 192, 384, 512],
          },
          {
            src: path.resolve('src/assets/icon-pwa-512x512.png'),
            sizes: [120, 152, 167, 180],
            ios: true,
          },
        ],
      }),
    ]
  });
