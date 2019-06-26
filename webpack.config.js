/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

module.exports = {
  devtool: "source-map",
  entry: "./src/page/index.tsx",
  externals: {
    jquery: "jQuery"
  },
  mode: process.env.NODE_ENV ? process.env.NODE_ENV : "production",
  module: {
    rules: [
      {
        exclude: /node_modules|bin/u,
        loader: "ts-loader",
        options: {
          configFile: "react.tsconfig.json"
        },
        test: /\.tsx?$/u
      },
      {
        enforce: "pre",
        loader: "source-map-loader",
        test: /\.js$/u
      }
    ]
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "bin/page")
  },
  resolve: {
    extensions: [
      ".ts",
      ".tsx",
      ".js",
      ".json"
    ]
  }
};
