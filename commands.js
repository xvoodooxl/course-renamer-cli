const fs = require('fs');
const os = require('os');
const path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);


exports.listItems = (pathToDir) => {
  let finished = [];
  let result = [];
  if (os.platform() === 'win32') {
    const items = fs.readdirSync(pathToDir);
    items.forEach(item => {
      const newObject = {
        fullPath: path.join(pathToDir, '\\', item),
        folderPath: path.parse(item).dir.normalize(),
        folderName: pathToDir.split('\\').pop(),
        extname: path.parse(item).ext,
        filename: path.parse(item).name
      };
      finished.push(newObject);
      result = finished.filter(item => (item.extname === '.mp4' || item.extname === '.mkv'));
    });

  } else if (os.platform() === 'linux') {
    const items = fs.readdirSync(pathToDir);
    items.forEach(item => {
      const newObject = {
        fullPath: path.join(pathToDir, '/', item),
        folderPath: pathToDir,
        folderName: pathToDir.split('/').pop(),
        extname: path.parse(item).ext,
        filename: path.parse(item).name,
        fullname: path.parse(item).base
      };
      finished.push(newObject);
      result = finished.filter(item => (item.extname === '.mp4' || item.extname === '.mkv'));
    });
  }

  console.log('Success! List created 😁');
  return result;
};



exports.createOutputFolder = (folderPath) => {
  try {
    if (!fs.existsSync(`${folderPath}/output`)) {
      fs.mkdirSync(`${folderPath}/output`)
      console.log('Success Directory Created! 👍')
      return `${folderPath}/output/`
    } else {
      console.log('directory exists! 😐')
      return `${folderPath}/output/`
    }
  } catch (err) {
    console.error(err)
  }
}

exports.changeTitle = (item, outputFolder) => {
  const command = ffmpeg(item.fullPath)
    .outputOptions('-codec copy')
    .outputOptions('-loglevel verbose')
    .outputOptions('-metadata', `title=${item.filename}`)
    .on('error', function (err) {
      console.log('An error occurred: ' + err.message);
    })
    .on('end', function () {
      console.log('Processing finished !');
    })
    .on('progress', (progress) => {
      console.log(progress);
    })
    .save(`${outputFolder}${item.filename}${item.extname}`);
};
