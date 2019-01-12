#!/usr/bin/env node
const program = require('commander');
const { 
  listItems,
  createOutputFolder,
  changeMetaTitle,
  copySrt,
  processFiles,
  sanitizeDirectory,
  sanitizeFiles } = require('./commands');

const operationRename = (pathToDir, recursive) => {
  
  if (recursive === true) { 
    sanitizeFiles(pathToDir);
    sanitizeDirectory(pathToDir); 
  };

  const items = listItems(pathToDir, recursive);
  const processed = processFiles(items, recursive);

  // console.log(processed);
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
  .action((cmd) => operationRename(cwd, cmd.recursive));

program.parse(process.argv);

