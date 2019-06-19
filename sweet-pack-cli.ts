#!/usr/bin/env node
import path from "path";
import sweetPack from "./sweet-pack";
import yargs from "yargs";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require(yargs.argv.config as string || path.resolve("./sweet.config.js"));
sweetPack(config as any);
