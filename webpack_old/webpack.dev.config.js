const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const DEV_MODE = process.env.NODE_ENV === 'development';
module.exports = {
  entry: {
    index: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', './src/index.js'],
    about: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', './src/index.js'],
  },
  output: {
    filename: DEV_MODE ? '[name].js' : '[name]-[chunkhash].js',
    chunkFilename: DEV_MODE ? '[name]-chunk.js' : '[name]-chunk-[chunkhash].js',
    path: path.join(__dirname, 'dist'),
  },
  mode: process.env.NODE_ENV,
  target: 'web',
  devtool: DEV_MODE ? 'inline-source-map' : false,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        // Loads the javacript into html template provided.
        // Entry point is set below in HtmlWebPackPlugin in Plugins 
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            //options: { minimize: true }
          }
        ]
      },
      {
        test: /\.pug$/,
        use: [
          { loader: 'html-loader' },
          {
            loader: 'pug-html-loader',
            options: {
              pretty: DEV_MODE,
            },
          },
        ],
        include: path.resolve('src/html'),
      },
      { 
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
       test: /\.(png|svg|jpg|gif)$/,
       use: ['file-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/html/index.html",
      filename: "./index.html",
      chunks: ['vendors', 'index'],
      excludeChunks: [ 'server' ]
    }),
    new HtmlWebPackPlugin({
      template: "./src/html/about.pug",
      filename: "./about.html",
      chunks: ['vendors', 'about'],
      excludeChunks: [ 'server' ]
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  optimization: {
    // https://webpack.js.org/plugins/split-chunks-plugin/#optimizationsplitchunks
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          name: 'vendors',
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          // https://webpack.js.org/plugins/split-chunks-plugin/#splitchunkscachegroupscachegroupenforce
          enforce: true,
        },
      },
    },
  },
}