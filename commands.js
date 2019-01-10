const fs = require('fs');
const path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const { padNumber, sanitizeString, walkSync } = require('./helpers');

ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * Find all files inside a dir, recursively.
 * @function listItems
 * @param  {string} dir path to directory to list all files that meet the req
 * @param  {string} recursive Tells the funtion if it should list the files recursively
 * @return {array[]} Array with all file names that are inside the directory.
 */

exports.listItems = (dir, recursive = false) => {
  let filtered = [];
  if ( recursive === true ) {
    filtered = walkSync(dir).filter(item => (path.parse(item).ext === '.mp4' || path.parse(item).ext === '.mkv'));
  } else {
    temp = fs.readdirSync(dir).filter(item => (path.parse(item).ext === '.mp4' || path.parse(item).ext === '.mkv'));
    temp.forEach( (item) => {
      let newItem = path.join(dir, item);
      filtered.push(newItem);
    })
  }
  return filtered;
};

exports.processFiles = (items, recursive = false) => {
  let counter = 1;
  const result = [];

  items.forEach(item => {
    const { dir, base, ext, name } = path.parse(item);
    const data = {
      fullPath: path.join(dir, base).replace(/\\/g, '/'),
      folderPath: dir,
      folderName: sanitizeString(dir.split('/').pop()),
      extname: ext,
      filename: name,
      fullname: dir.split('/').pop(),
      number: counter,
    };

    data.subtitlePath = getSubtitle(data.fullPath),
    data.newname = `${recursive ? dir.split('/').slice(-2, -1) : data.folderName} - s01e${padNumber(counter)} - ${sanitizeString(data.filename)}`;
    data.newSubtitleName = `${data.newname}.srt`
    result.push(data);
    counter = counter + 1;
  });
  console.log(result);
  return result;
};

function getSubtitle(pathToFile) {
  let subtitlePath = null;

  const { dir, name } = path.parse(pathToFile);
  subtitlePathNo = `${path.join(dir, name).replace(/\\/g, '/')}.srt`;
  subtitlePathDash = `${path.join(dir, name).replace(/\\/g, '/')}-en.srt`;
  subtitlePathDot = `${path.join(dir, name).replace(/\\/g, '/')}.en.srt`;

  if (fs.existsSync(subtitlePathNo)) {
    subtitlePath = subtitlePathNo;
  } else if (fs.existsSync(subtitlePathDash)) {
    subtitlePath = subtitlePathDash;
  } else if (fs.existsSync(subtitlePathDot)) {
    subtitlePath = subtitlePathDot;
  }

  return subtitlePath;
}


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
   ffmpeg(item.fullPath)
    .outputOptions('-codec copy')
    .outputOptions('-loglevel verbose')
    .outputOptions('-metadata', `title=${sanitizeString(item.filename)}`)
    .on('error', function (err) {
      console.log('An error occurred: ' + err.message);
    })
    .on('end', function () {
      console.log('Processing finished 😁!');
    })
    .on('progress', (progress) => {
      // console.log(progress);
    })
    .save(`${outputFolder}${item.newname}${item.extname}`);
};

exports.copySrt = (item, output) => {
let subtitlePath = item.subtitlePath;
const newSubtitlePath = `${path.join(output, item.newSubtitleName)}`

  if (subtitlePath !== null) {
    fs.copyFile(subtitlePath, newSubtitlePath, (err) => {
      if (err) throw err;
      console.log('Subtitle succesfully copied');
    });
  }
}