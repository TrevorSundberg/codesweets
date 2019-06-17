import HtmlWebpackPlugin from "html-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import fs from "fs";
import path from "path";
import tmp from "tmp";
import traverse from "traverse";
import webpack from "webpack";

tmp.setGracefulCleanup();

type Mode = "development" | "production"
type Entry = string | string[] | webpack.Entry

const mode: Mode = process.env.NODE_ENV ? process.env.NODE_ENV as Mode : "production";
const dist = path.resolve(__dirname, "dist");

const createWebpackConfig = (entry: Entry, tsconfigPath: string): webpack.Configuration => ({
  devtool: mode === "development" ? "source-map" : false,
  entry,
  mode,
  module: {
    rules: [
      {
        exclude: /node_modules|bin|dist/u,
        loader: "ts-loader",
        options: {
          configFile: tsconfigPath
        },
        test: /\.tsx?$/u
      }
    ]
  },
  node: {
    Buffer: true,
    __dirname: true,
    __filename: true,
    child_process: "empty",
    dns: "mock",
    fsevents: true,
    global: true,
    inspector: true,
    module: "empty",
    net: "mock",
    os: true,
    process: true,
    tls: "mock"
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true
        }
      })
    ]
  },
  output: {
    filename: "[name].js",
    path: dist
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(mode),
        PASS: JSON.stringify(process.env.PASS),
        USER: JSON.stringify(process.env.USER)
      }
    }),
    new HtmlWebpackPlugin()
  ],
  resolve: {
    alias: {
      fs: "memfs"
    },
    extensions: [
      ".tsx",
      ".ts",
      ".js"
    ]
  },
  resolveLoader: {
    modules: [
      "node_modules",
      __dirname
    ]
  },
  target: "web"
});

const pack = async (entry: Entry, logger = console.log) => {
  const files: string[] = [];
  traverse(entry).forEach((val) => {
    if (typeof val === "string") {
      files.push(path.resolve(val));
    }
  });

  const tsconfig = {
    compilerOptions: {
      baseUrl: ".",
      esModuleInterop: true,
      module: "commonjs",
      moduleResolution: "node",
      noImplicitAny: true,
      outDir: dist,
      preserveConstEnums: true,
      removeComments: false,
      sourceMap: true,
      target: "es2018"
    },
    files
  };

  // eslint-disable-next-line no-sync
  const tsconfigFile = tmp.fileSync({
    dir: process.cwd(),
    postfix: ".tsconfig.json",
    prefix: "."
  });
  await fs.promises.writeFile(tsconfigFile.name, JSON.stringify(tsconfig, null, 2));

  const compiler = webpack(createWebpackConfig(entry, tsconfigFile.name));
  return new Promise((resolve, reject) => compiler.run((err, stats) => {
    if (err) {
      reject(err);
    }
    logger(stats.toString());
    resolve(stats);
  }));
};
export default pack;
