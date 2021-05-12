const path = require("path"),
  webpack = require("webpack"),
  merge = require("webpack-merge"),
  base = require("./webpack.base"),
  HTMLWebpack = require("html-webpack-plugin");

module.exports = merge(base, {
  devtool: "cheap-modules-eval-source-map",
  mode: "development",
  devServer: {
    port: "3000",
    // host: "localhost",
    host: "0.0.0.0",
    proxy: {
      "/api": "",
    },
    contentBase: path.join(__dirname, "../public"),
    stats: { color: true },
    compress: true,
    historyApiFallback: true,
    hot: true,
    https: false,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HTMLWebpack({
      title: "ipec dev",
      filename: "index.html",
      template: "../src/index.html"
    }),
  ]
});
