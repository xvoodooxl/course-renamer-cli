const fs = require('fs');
const path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const {
  padNumber,
  sanitizeString,
  walkSync,
  getSubtitle,
  folderSortOrder,
  getDirectories,
} = require('./helpers');

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
  if (recursive === true) {
    filtered = walkSync(dir).filter(
      item => path.parse(item).ext === '.mp4' || path.parse(item).ext === '.mkv'
    );
  } else {
    const temp = fs
      .readdirSync(dir)
      .filter(
        item =>
          path.parse(item).ext === '.mp4' || path.parse(item).ext === '.mkv'
      );
    temp.forEach(item => {
      const newItem = path.join(dir, item).replace(/\\/g, '/');
      filtered.push(newItem);
    });
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

    (data.subtitlePath = getSubtitle(data.fullPath))(
      (data.newname = `${
        recursive ? dir.split('/').slice(-2, -1) : data.folderName
      } - s01e${padNumber(counter)} - ${sanitizeString(data.filename)}`)
    );
    data.newSubtitleName = `${data.newname}.srt`;
    result.push(data);
    counter += 1;
  });
  // console.log(result);
  return result;
};

exports.createOutputFolder = folderPath => {
  try {
    if (!fs.existsSync(`${folderPath}/Season 01`)) {
      fs.mkdirSync(`${folderPath}/Season 01`);
      console.log('Success Directory Created! 👍');
      return `${folderPath}/Season 01/`;
    }
    console.log('directory exists! 😐');
    return `${folderPath}/Season 01/`;
  } catch (err) {
    console.error(err);
  }
};

exports.changeMetaTitle = (item, outputFolder) => {
  ffmpeg(item.fullPath)
    .outputOptions('-codec copy')
    .outputOptions('-loglevel verbose')
    .outputOptions('-metadata', `title=${sanitizeString(item.filename)}`)
    .on('error', err => {
      console.log(`An error occurred: ${err.message}`);
    })
    .on('end', () => {
      console.log(`Processing finished for file ${item.newname} 😁!`);
    })
    .on('progress', progress => {
      // console.log(progress);
    })
    .save(`${outputFolder}${item.newname}${item.extname}`);
};

exports.copySrt = (item, output) => {
  const { subtitlePath } = item;
  const newSubtitlePath = `${path.join(output, item.newSubtitleName)}`;

  if (subtitlePath !== null) {
    fs.copyFile(subtitlePath, newSubtitlePath, err => {
      if (err) throw err;
      console.log('Subtitle succesfully copied');
    });
  }
};

exports.sanitizeFiles = directory => {
  const list = walkSync(directory);
  list.forEach(item => {
    const { base, dir } = path.parse(item);
    const newName = folderSortOrder(base);
    // console.log(item);
    fs.rename(item, path.join(dir, newName), err => {
      // console.log(err);
    });
  });
};

exports.sanitizeDirectory = directory => {
  const original = getDirectories(directory);

  original.forEach(item => {
    const { base, dir } = path.parse(item);
    const newName = folderSortOrder(base);

    fs.rename(item, path.join(dir, newName), err => {
      // console.log(err);
    });
  });
};
