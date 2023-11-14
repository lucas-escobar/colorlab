const path = require("path");

module.exports = {
  entry: {
    index: "./src/core/static/core/js/renderer.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "./src/core/static/core/js/dist/"),
  },
  mode: "development",
};
