const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const WebpackAutoInject = require('webpack-auto-inject-version');

const devMode = process.env.NODE_ENV !== 'production';
const srcDir = path.join(__dirname, '/src');
const srcScriptsDir = path.join(__dirname, '/src/scripts');

const basePrefix = '/my/spa/';

const config = {
  entry: ['./src/scripts/index.tsx', './src/styles/styles.scss'],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'scripts/index.js',
    publicPath: basePrefix,
  },
  devServer: {
    overlay: true,
    historyApiFallback: { disableDotRule: true },
    contentBase: path.join(__dirname, './dist'),
    port: 3000,
    stats: 'errors-warnings',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'src'),
        use: [{ loader: 'babel-loader' }, { loader: 'eslint-loader' }],
        exclude: '/node_modules/',
      },
      {
        test: /\.tsx?$/,
        use: [{ loader: 'ts-loader', options: { transpileOnly: true } }],
        exclude: '/node_modules/',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        include: path.resolve(__dirname, 'src'),
        use: [MiniCssExtractPlugin.loader, { loader: 'css-loader', options: { url: false, importLoaders: 2 } }],
        exclude: '/node_modules/',
      },
      {
        test: /\.(jpg|jpeg|png|gif)$/i,
        include: path.resolve(__dirname, 'src/scripts/components'),
        use: [{ loader: 'url-loader', options: { limit: 25000 } }],
        exclude: '/node_modules/',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', 'scss', '.png', '.jpg'],
    alias: {},
  },
  plugins: [
    new WebpackAutoInject({
      PACKAGE_JSON_INDENT: 2,
      components: {
        AutoIncreaseVersion: false,
        InjectAsComment: false,
        InjectByTag: true,
      },
      componentsOptions: {
        AutoIncreaseVersion: {
          runInWatchMode: false,
        },
        InjectByTag: {
          fileRegex: /\.js/,
          AIVTagRegexp: /(\[AIV])(([a-zA-Z{} .,:;!()_@\-"'\\\/])+)(\[\/AIV])/g,
          dateFormat: 'UTC:yyyy-mm-dd HH:MM Z',
        },
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      template: './src/index.html',
      filename: 'index.html',
    }),
    new CopyWebpackPlugin(
      [
        {
          from: './src/fonts',
          to: './fonts',
        },
        {
          from: './src/favicon',
          to: './favicon',
        },
        {
          from: './src/images',
          to: './images',
        },
        {
          from: './src/assets',
          to: './assets',
        },
      ],
      { copyUnmodified: false },
    ),
    new WriteFilePlugin(),
    new ForkTsCheckerWebpackPlugin({ async: false }),
  ],
  stats: {
    warningsFilter: /export .* was not found in/,
  },
  // optimization: {
  //     minimizer: [
  //         new UglifyJsPlugin({
  //             cache: true,
  //             parallel: true,
  //             sourceMap: true // set to true if you want JS source maps
  //         }),
  //         new OptimizeCSSAssetsPlugin({}),
  //     ],
  // },
  // devtool: 'eval-sourcemap',
};

module.exports = (env, option) => {
  if (option !== undefined && option.mode === 'production') {
    config.devtool = 'source-map';
    config.plugins.push(new CleanWebpackPlugin('dist', {}));
  } else {
    config.devtool = 'eval-sourcemap';
  }
  return config;
};
