#!/usr/bin/env node

const {join} = require('path');
const {promisify} = require('util');
const exec = promisify(require('child_process').exec);
const {outputFile, remove} = require('fs-extra');
const program = require('commander');

const cacheDirectory = 'cache';
const commandDirectory = process.cwd();

program
  .version('1.0.0', '-v, --version')
  .option('-s, --source <val>', 'Source typescript file')
  .option('-sn, --sourceName <val>', 'Name of the source object')
  .option('-t, --tsconfig <val>', 'tsconfig location')
  .option('-d, --destination <val>', 'destination file')
  .parse(process.argv);

program.source = program.source || 'api.spec.ts';
program.sourceName = program.sourceName || 'API_SPEC';
program.tsconfig = program.tsconfig || 'tsconfig.json';
program.destination = program.destination || 'api.spec.js';

async function execute() {

  /**
   * Clean anything in the current cache
   */
  await remove(cacheDirectory);

  await exec(`npm run tsc -- --outDir ${cacheDirectory} --p ${join(commandDirectory, program.tsconfig)}`);

  const toCompile = require(`./${commandDirectory}/${program.source}`)[program.sourceName];

  console.log('bla', toCompile);

  await outputFile(join(commandDirectory, program.destination), JSON.stringify(toCompile, null, 4));
}


execute()
  .then()
  .catch(err => console.error(err));
