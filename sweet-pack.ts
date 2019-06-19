import fs from "fs";
import path from "path";
import tmp from "tmp";
import webpack from "webpack";

tmp.setGracefulCleanup();

type Mode = "development" | "production"

const mode: Mode = process.env.NODE_ENV ? process.env.NODE_ENV as Mode : "production";
const dist = path.resolve("dist");

export type Logger = (...args: any[]) => any

export interface Dependencies { [name: string]: string }

export interface Config {
  entry: {
    [file: string]: Dependencies;
  };
  logger: (...args: any[]) => any;
}

const packSingle = async (file: string, deps: Dependencies) => {
  const {name} = path.parse(file);
  const tsconfig = {
    compilerOptions: {
      baseUrl: ".",
      esModuleInterop: true,
      module: "esnext",
      moduleResolution: "node",
      noImplicitAny: true,
      outDir: dist,
      preserveConstEnums: true,
      removeComments: false,
      sourceMap: true,
      target: "es2018"
    },
    files: [file]
  };

  // eslint-disable-next-line no-sync
  const tsconfigFile = tmp.fileSync({
    dir: process.cwd(),
    postfix: ".sweet-pack-tsconfig.json",
    prefix: "."
  });
  await fs.promises.writeFile(tsconfigFile.name, JSON.stringify(tsconfig, null, 2));

  const externals: webpack.ExternalsObjectElement = {};
  const dependencies = Object.entries(deps).map((pair) => ({name: pair[0], path: pair[1]}));

  for (const dep of dependencies) {
    externals[dep.path] = `__imports[${JSON.stringify(dep.name)}]`;
  }

  const compiler = webpack({
    devtool: mode === "development" ? "source-map" : false,
    entry: {
      [name]: file
    },
    externals,
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
      filename: `${name}.js`,
      library: name,
      libraryTarget: "var",
      path: dist
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(mode),
          PASS: JSON.stringify(process.env.PASS),
          USER: JSON.stringify(process.env.USER)
        }
      })
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

  const result: webpack.Stats = await new Promise((resolve, reject) => compiler.run((err, stats) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(stats);
  }));

  let final = "var __imports = {}\n";
  final += dependencies.map((dep, index) => "" +
    `import __import${index} from ${JSON.stringify(`./${dep.name}.js`)};\n` +
    `__imports[${JSON.stringify(dep.name)}] = __import${index};\n`).join("");
  const jsPath = path.join(dist, `${name}.js`);
  final += await fs.promises.readFile(jsPath, "utf8");
  final += `\nexport default ${name};`;

  await fs.promises.writeFile(jsPath, final, "utf8");
  return result;
};

export default async (config: Config) => {
  const logger = config.logger || console.log;
  const results = await Promise.all(Object.entries(config.entry).map((pair) => packSingle(pair[0], pair[1])));
  results.forEach((result) => {
    logger(`\n${"-".repeat(80)}`);
    logger(result.toString());
  });
};
