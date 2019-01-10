#!/usr/bin/env node
const program = require('commander');
const { listItems, createOutputFolder, changeMetaTitle, copySrt, processFiles } = require('./commands');

const operation = (pathToDir, recursive) => {
  const items = listItems(pathToDir, recursive);
  const processed = processFiles(items, recursive);
  const output = createOutputFolder(pathToDir);
  processed.forEach((item) => {
    copySrt(item, output)
    changeMetaTitle(item, output)
  });
}

const cwd = process.cwd();

program
  .version('1.0.1')
  .description('Simple renamer cli tool');

program
  .command('rename')
  .option('-r, --recursive', 'Rename folders recursively')
  .alias('r')
  .description('Rename all files in the path folder')
  .action((cmd) => operation(cwd, cmd.recursive));

program.parse(process.argv);

