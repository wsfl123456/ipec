const path = require("path"),
  MiniCSSExtract = require("mini-css-extract-plugin");

const DEV = process.env.NODE_ENV === "development";

const postcss = {
  loader: "postcss-loader",
  options: {
    sourceMap: DEV,
    plugins: [
      require("autoprefixer")({
        overrideBrowserslist: ["iOS > 7", "Android > 4", "Chrome > 31", "ff > 31"]
      })
    ],
  }
};

const styles = [{
  test: /\.scss$/,
  use: ["style-loader", "css-loader", postcss, "sass-loader"],
  include: [path.join(__dirname, "../src")]
}, {
  test: /\.css$/,
  use: ["style-loader", "css-loader", postcss],
}];

if (!DEV) {
  styles.forEach(rule => rule.use.splice(0, 1, MiniCSSExtract.loader))
}

module.exports = styles;
