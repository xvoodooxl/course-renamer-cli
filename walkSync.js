const fs = require('fs');
const os = require('os');
const path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const { padNumber, sanitizeString, walkSync } = require('./helpers');
const { listItems } = require('./commands');

ffmpeg.setFfmpegPath(ffmpegPath);

// /**
//  * Find all files inside a dir, recursively.
//  * @function listItems
//  * @param  {string} dir path to directory to list all files that meet the req
//  * @return {array[]} Array with all file names that are inside the directory.
//  */

// exports.listItemsRecursive = (dir, recursive = false) => {
//   let counter = 1;

//   const flatten = arr => arr.reduce((acc, val) =>
//     acc.concat(Array.isArray(val) ? flatten(val) : val), []);

//   Array.prototype.flatten = function () { return flatten(this) };

//   const walkSync = dir => fs.readdirSync(dir)
//     .map(file => fs.statSync(path.join(dir, file)).isDirectory()
//       ? walkSync(path.join(dir, file))
//       : path.join(dir, file).replace(/\\/g, '/')).flatten();

//   const result = [];

//   const filtered = walkSync(dir).filter(item => (path.parse(item).ext === '.mp4' || path.parse(item).ext === '.mkv'));

//   console.log(filtered);

//   filtered.forEach(item => {
//     const data = {
//       fullPath: path.join(path.parse(item).dir, '/', path.parse(item).base).replace(/\\/g, '/'),
//       folderPath: path.parse(item).dir,
//       folderName: path.parse(item).dir.split('/').pop(),
//       extname: path.parse(item).ext,
//       filename: path.parse(item).name,
//       fullname: path.parse(item).dir.split('/').pop(),
//       number: counter
//     };

//     data.newname = `${recursive ? path.parse(item).dir.split('/').slice(-2, -1) : data.folderName} - s01e${padNumber(counter)} - ${sanitizeString(data.filename)}`;
//     result.push(data);
//     counter = counter + 1;
//   });
//   console.log(result);
//   return result;
// };

// exports.copySrt = (items) => {
//   // TODO - Grab list of files

//   // TODO - Check if srt file exists
//   let newitems = items.filter(item => path.parse(item.fullPath).ext === '.srt')

//   // TODO - If srt files exists rename with new name

//   // TODO - Move new srt file to output folder
//   console.log(newitems);
//   // items.forEach( item => {
//   //   fs.copyFile(item.fullPath, `${output}/${item.newname}`, (err) => {
//   //     if (err) throw err;
//   //     console.log('source.txt was copied to destination.txt');
//   //   });
//   // })
// }

// function walkSync (dir) {
//   const flatten = arr => arr.reduce((acc, val) =>
//     acc.concat(Array.isArray(val) ? flatten(val) : val), []);

//   Array.prototype.flatten = function () { return flatten(this) };

//   const walkSyncInternal = dir => fs.readdirSync(dir)
//     .map(file => fs.statSync(path.join(dir, file)).isDirectory()
//       ? walkSync(path.join(dir, file))
//       : path.join(dir, file).replace(/\\/g, '/')).flatten();

//   return walkSyncInternal(dir);
// }

// const test = walkSync('/mnt/e/temp/React Front to Back');
// console.log(test);

// function getSubtitle(pathToFile) {
//   let subtitlePath = null;

//   const { dir, name } = path.parse(pathToFile);

//   const basePath = path.join(dir, name).replace(/\\/g, '/');
//   const ext = '.srt'
//   const lang = ['', '-en', '.en', '.es', '-es', '-eng', '.eng', '-spa', '.spa'];

//   for (let i = 0;  i <= lang.length ; i++) {
//     if(fs.existsSync(`${basePath}${lang[i]}${ext}`)) {
//       return subtitlePath = `${basePath}${lang[i]}${ext}`
//     }
//   }

//   return subtitlePath;
// }

// const testPath = '/mnt/e/temp/React Front to Back/01. Cours2313132e Introduction/1. Welcome To The Course.mp4'

// const subtitle = getSubtitle(testPath);

// console.log(subtitle);

// testDirectory = '/mnt/e/temp/React Front to Back'
// // testString = '10. Client Panel Firebase Project - Part 1';

// const folderSortOrder = (string) => {
//   console.log(string);
//   // const substring = ;
//   let numb = string.slice(0, 5).match(/\d/g).join('');
//   const folder = sanitizeString(string);
//   numb = padNumber(numb, 3);

//   const newName = `${numb}. ${folder}`
//   return newName;
// }

// // const result = folderSortOrder(testString);
// // console.log(result);

// const getDirectories = (directory) => {
//   const isDirectory = fileName => {
//     return fs.lstatSync(fileName).isDirectory();
//   }

//   return fs.readdirSync(directory).map(fileName => {
//     return path.join(directory, fileName)
//   }).filter(isDirectory);
// };

// // const test = getDirectories(testDirectory);
// // console.log(test);

// const sanitizeDirectory = (directory) => {
//   const original = getDirectories(directory);

//   original.forEach(item => {
//     const {base, dir} = path.parse(item);
//     const newName = folderSortOrder(base);

//     fs.rename(item, path.join(dir, newName), (err) => {
//       console.log(err);
//     });
//   });
// };

// const sanitizeFiles = (directory) => {
//   const list = walkSync(testDirectory);
//   list.forEach(item => {
//     const { base, dir } = path.parse(item);
//     const newName = folderSortOrder(base);
//       console.log(item);
//     fs.rename(item, path.join(dir, newName), (err) => {
//       console.log(err);
//     });
//   });
// };

// // const testSanitize = sanitizeDirectory(testDirectory);

// sanitizeFiles(testDirectory);

const pretty = require('prettyjson');

const data = {
  name: 'Fermin',
  Age: 26,
  Domain: 'ferSolis.io',
  Email: 'contact@ferSolis.io',
  Address: 'Domingo Funes 450',
  Status: true,
  dogs: {
    dog1: 'Nala',
    dog2: 'Molly',
  },
};

const data2 = [
  {
    name: 'Fermin',
    Age: 26,
    Domain: 'ferSolis.io',
    Email: 'contact@ferSolis.io',
    Address: 'Domingo Funes 450',
    Status: true,
    dogs: {
      dog1: 'Nala',
      dog2: 'Molly',
    },
  },
  {
    name: 'Fermin',
    Age: 26,
    Domain: 'ferSolis.io',
    Email: 'contact@ferSolis.io',
    Address: 'Domingo Funes 450',
    Status: true,
    dogs: {
      dog1: 'Nala',
      dog2: 'Molly',
    },
  },
  {
    name: 'Fermin',
    Age: 26,
    Domain: 'ferSolis.io',
    Email: 'contact@ferSolis.io',
    Address: 'Domingo Funes 450',
    Status: true,
    dogs: {
      dog1: 'Nala',
      dog2: 'Molly',
    },
  },
];

// console.log(pretty.render(data));

// console.log(pretty.render(data, {
//   keysColor: 'yellow',
//   dashColor: 'magenta',
//   stringColor: 'white',
//   numberColor: 'white',

// }));

function consolePretty(data) {
  const options = {
    keysColor: 'yellow',
    dashColor: 'magenta',
    stringColor: 'white',
    numberColor: 'white',
  };

  return console.log(pretty.render(data, options));
}

consolePretty(data2);
