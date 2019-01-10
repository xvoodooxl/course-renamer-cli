const fs = require('fs');
const os = require('os');
const path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const { padNumber, sanitizeString } = require('./helpers');

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


function walkSync (dir) {
  const flatten = arr => arr.reduce((acc, val) =>
    acc.concat(Array.isArray(val) ? flatten(val) : val), []);

  Array.prototype.flatten = function () { return flatten(this) };

  const walkSyncInternal = dir => fs.readdirSync(dir)
    .map(file => fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file))
      : path.join(dir, file).replace(/\\/g, '/')).flatten();

  return walkSyncInternal(dir);    
}


const test = walkSync('/mnt/e/temp/React Front to Back');
console.log(test);