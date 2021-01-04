const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const DEV_MODE = process.env.NODE_ENV === 'development';

module.exports = {
  entry: {
    index: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', './src/index.js'],
  },
  output: {
    filename: DEV_MODE ? '[name].js' : '[name]-[hash].js',
    chunkFilename: DEV_MODE ? '[name]-chunk.js' : '[name]-chunk-[hash].js',
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
            options: { minimize: DEV_MODE }
          }
        ]
      },
      { 
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(svg|woff|woff2|ttf|eot|otf)([\?]?.*)$/,
        loader: 'file-loader?name=assets/fonts/[name].[ext]',
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
    new MiniCssExtractPlugin({
      filename: DEV_MODE ? '[name].css' : '[name]-[contenthash].css',
    }),
    new webpack.DefinePlugin({}),
    ...DEV_MODE
      ? []
      : [
        new OptimizeCSSAssetsPlugin(),
      ],
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
   })
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
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      })
    ]
  },
}