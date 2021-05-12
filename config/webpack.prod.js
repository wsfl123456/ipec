"use strict"

const path = require("path"),
  webpack = require("webpack"),
  base = require("./webpack.base"),
  merge = require("webpack-merge"),
  HTMLWebpack = require("html-webpack-plugin"),
  CleanWebpack = require("clean-webpack-plugin"),
  OptimizeCSSAssets = require("optimize-css-assets-webpack-plugin");

const configEnv = {
  start: "development",
  prod: "production",
  rel: "production",
  dev: "production",
};
const PROD = configEnv[process.env.NODE_ENV] === "production";

module.exports = merge(base, {
  mode: "production",
  devtool: false,
  plugins: [
    new CleanWebpack(["public"], { root: path.resolve(__dirname, "../") }),
    new OptimizeCSSAssets({}),
    new HTMLWebpack({
      title: "IP二厂",
      filename: "index.html",
      template: path.resolve(__dirname, "../src/index.html"),
      inject: true,
      minify: {
        minifyJS: true,
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
    }),
    new webpack.HashedModuleIdsPlugin(),
  ],
});
