#!/usr/bin/env node
const program = require('commander');
const { listItems, createOutputFolder, changeTitle } = require('./commands');

const operation = pathToDir => {
  const items = listItems(pathToDir);
  const output = createOutputFolder(pathToDir);

  items.forEach( (item) => changeTitle(item, output));
}

const cwd = process.cwd();

program
  .version('1.0.1')
  .description('Simple renamer cli tool');

program
  .command('list')
  .alias('l')
  .description('Request a path to be parsed')
  .action( () => listItems(cwd));
  
program
  .command('rename <path>')
  .alias('r')
  .description('Rename all files in the path folder')
  .action( path => { operation(path) });

  program
  .command('rename')
  .alias('r')
  .description('Rename all files in the path folder')
  .action( () => operation(cwd));

program.parse(process.argv);

