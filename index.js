#!/usr/bin/env node
const program = require('commander');
const { listItems, createOutputFolder, changeMetaTitle, copySrt } = require('./commands');

const operation = pathToDir => {
  const items = listItems(pathToDir);
  console.log(items)

  const output = createOutputFolder(pathToDir);

  items.forEach( (item) => changeMetaTitle(item, output));
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
  .command('rename')
  .alias('r')
  .description('Rename all files in the path folder')
  .action( () => operation(cwd));

program.parse(process.argv);

