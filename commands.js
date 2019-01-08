const fs = require('fs');
const os = require('os');
const path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const { padNumber, sanitizeString } = require('./helpers');

ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * Find all files inside a dir, recursively.
 * @function listItems
 * @param  {string} dir path to directory to list all files that meet the req
 * @return {array[]} Array with all file names that are inside the directory.
 */

exports.listItems = (dir) => {
  let counter = 1;
  
  const flatten = arr => arr.reduce((acc, val) =>
    acc.concat(Array.isArray(val) ? flatten(val) : val), []);
  Array.prototype.flatten = function () { return flatten(this) };

  const walkSync = dir => fs.readdirSync(dir)
    .map(file => fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file))
      : path.join(dir, file).replace(/\\/g, '/')).flatten();

  const result = [];

  const filtered = walkSync(dir).filter(item => (path.parse(item).ext === '.mp4' || path.parse(item).ext === '.mkv'));

  console.log(filtered);

  filtered.forEach(item => {
    const data = {
      fullPath: path.join(path.parse(item).dir, '/', path.parse(item).base).replace(/\\/g, '/'),
      folderPath: path.parse(item).dir,
      folderName: path.parse(item).dir.split('/').pop(),
      extname: path.parse(item).ext,
      filename: path.parse(item).name,
      fullname: path.parse(item).dir.split('/').pop(),
      number: counter
    };

    data.newname = `${path.parse(item).dir.split('/').slice(-2, -1)} - s01e${padNumber(counter)} - ${sanitizeString(data.filename)}`;
    result.push(data);
    counter = counter + 1;
  });

  return result;
};



exports.createOutputFolder = (folderPath) => {
  try {
    if (!fs.existsSync(`${folderPath}/Season 01`)) {
      fs.mkdirSync(`${folderPath}/Season 01`)
      console.log('Success Directory Created! 👍')
      return `${folderPath}/Season 01/`
    } else {
      console.log('directory exists! 😐')
      return `${folderPath}/Season 01/`
    }
  } catch (err) {
    console.error(err)
  }
}

exports.changeMetaTitle = (item, outputFolder) => {
  const command = ffmpeg(item.fullPath)
    .outputOptions('-codec copy')
    .outputOptions('-loglevel verbose')
    .outputOptions('-metadata', `title=${sanitizeString(item.filename)}`)
    .on('error', function (err) {
      console.log('An error occurred: ' + err.message);
    })
    .on('end', function () {
      console.log('Processing finished !');
    })
    .on('progress', (progress) => {
      console.log(progress);
    })
    .save(`${outputFolder}${item.newname}${item.extname}`);
};

exports.copySrt = (items) => {

  let newitems = items.filter(item => path.parse(item.fullPath).ext === '.srt')

  console.log(newitems);
  // items.forEach( item => {
  //   fs.copyFile(item.fullPath, `${output}/${item.newname}`, (err) => {
  //     if (err) throw err;
  //     console.log('source.txt was copied to destination.txt');
  //   });
  // }) 
}