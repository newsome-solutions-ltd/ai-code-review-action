#! /usr/bin/env node
'use strict'

// const yargs = require("yargs");
const loggerFactory = require("./LoggerFactory");

const log = loggerFactory.createLogger();

// const options = yargs
//  .usage("Usage: [-t <tag prefix> -s <scheme> -p <placholder> -d <workdir>]")
//  .option("t", { alias: "tag", describe: "Tag prefix, defaults to 'v'", type: "string", demandOption: false, default: 'v' })
//  .option("s", { alias: "scheme", describe: "Version scheme pattern, see documentation for details", type: "string", demandOption: false })
//  .option("p", { alias: "placeholder", describe: "Version scheme pattern placeholder for the number to increment", type: "string", demandOption: false, default: 'x' })
//  .option("d", { alias: "workdir", description: "Working directory, defaults to current dir.", demandOption: false, default: "."})
//  .argv;

const greeting = `Invoking AI code review...`;

log.debug(greeting);
