#! /usr/bin/env node

// --------------------------------------------------------------- Imports

const { execSync } = require("child_process");
const loggerFactory = require("../../main/js/LoggerFactory");

// ------------------------------------------------------------- Variables 

const log = loggerFactory.createLogger();

// ------------------------------------------------------ Global functions 

function run(args) {
    const output = execSync("node . " + args).toString();
    log.debug('output: ' + output);
}

// ----------------------------------------------------------------- tests

test('should be invoked', () => {
    // this runs the main index.js script, with the defaults
    run("");
});
