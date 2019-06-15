import HtmlWebpackPlugin from "html-webpack-plugin";
import fs from "fs";
import path from "path";
import tmp from "tmp";
import traverse from "traverse";
import webpack from "webpack";

tmp.setGracefulCleanup();

const mode: "development" | "production" = "development";
const dist = path.resolve(__dirname, "dist");

export default async (entry: string | string[] | webpack.Entry, logger = console.log) => {
  const files: string[] = [];
  traverse(entry).forEach((val) => {
    if (typeof val === "string") {
      files.push(path.resolve(val));
    }
  });

  const tsconfig = {
    compilerOptions: {
      esModuleInterop: true,
      module: "commonjs",
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
    postfix: ".tsconfig.json"
  });
  process.once("exit", () => tsconfigFile.removeCallback());
  await fs.promises.writeFile(tsconfigFile.name, JSON.stringify(tsconfig, null, 2));

  const compiler = webpack({
    devtool: mode === "development" ? "source-map" : null,
    entry,
    mode,
    module: {
      rules: [
        {
          exclude: /node_modules|bin|dist/u,
          loader: "ts-loader",
          options: {
            configFile: tsconfigFile.name
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
        ".tsxtsx",
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

  return new Promise((resolve, reject) => compiler.run((err, stats) => {
    if (err) {
      reject(err);
    }
    logger(stats.toString());
    resolve(stats);
  }));
};
