#!/usr/bin/env node
import sweetPack from "./sweet-pack";
import yargs from "yargs";

const {argv} = yargs.demandCommand();
sweetPack(argv._);
