const fs = require('fs');
const path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const { padNumber, sanitizeString, walkSync, getSubtitle, folderSortOrder, getDirectories, jsonPretty } = require('./helpers');
const { promisify } = require('util');
const { listItems } = require('./commands');

const testPath = '/mnt/e/temp/react-front-to-back/'

const readDir = promisify(fs.readdir);

// async function readDirectory(directory) {
//   const list = await readDir(directory);
//   return list
// };

// const list = readDirectory(testPath);
// console.log(list);




// function getFiles(directory) {
//   const list = walkSync(directory).filter( item => 
//     path.parse(item).ext !== '.mp4' && 
//     path.parse(item).ext !== '.mkv' && 
//     path.parse(item).ext !== '.srt' );
//   jsonPretty(list);
// };

// getFiles(testPath)

// // const list = listItems(testPath, true);
// // jsonPretty(list);

// function processFiles (items, author, course, season = 1) {
//   let counter = 1;
//   const result = [];

//   items.forEach(item => {
//     const { dir, base, ext, name } = path.parse(item);
//     const data = {};
//     data.dir = dir;
//     data.path = path.join(dir, base);
//     data.ext = ext;
//     data.name = name;
//     data.author = author;
//     data.course = course;
//     data.season = padNumber(parseInt(season), 2);
//     data.episode = counter
//     data.output = path.join(author, `Season ${data.season}`);
//     data.newname = `${data.author} - s${data.season}e${data.episode} - ${sanitizeString(data.name)}`
//     data.newpath = `${path.join(data.output, data.newname)}${data.ext}`;

//     data.subtitlePath = getSubtitle(data.path),
//     // data.newname = `${recursive ? dir.split('/').slice(-2, -1) : data.folderName} - s01e${padNumber(counter)} - ${sanitizeString(data.filename)}`;
//     data.newSubtitleName = `${data.newname}.srt`
//     result.push(data);
//     counter = counter + 1;
//   });
//   // console.log(result);
//   return result;
// };

// const processed = processFiles(list, 'Traversy Media', 'React Front To Back', undefined);
// jsonPretty(processed);



// const outputTest = '/mnt/e/temp/output';



// function createOutputFolder (folderPath = process.cwd(), parent, course, season) {
//   let output;
//   let seasonN = padNumber(season);
//   const parentFolder = path.join(folderPath, parent);
//   const seasonFolder = path.join(folderPath, parent, `Season ${seasonN} - ${course}`)
//     if (!fs.existsSync(parentFolder)) {
//       fs.mkdirSync(parentFolder)
//       console.log('Success Directory Created! 👍')
//     } else {
//       console.log('directory exists! 😐')
//     }

//     if (!fs.existsSync(seasonFolder)) {
//       fs.mkdirSync(seasonFolder)
//       output = seasonFolder;
//     } else {
//       const list = getDirectories(parentFolder);
//       const numbers = list.map(item => parseInt(item.match(/\d/g)[1]))
//       const last = numbers[numbers.length - 1] + 1;
//       fs.mkdirSync(`${folderPath}/${parent}/Season ${padNumber(last)} - ${course}`)
//       output = `${folderPath}/${parent}/Season ${padNumber(last)} - ${course}`;
//     }

//     return output;
// }

// // createOutputFolder(outputTest, 'Traversy Media', 'React Front To Back', 1);
// const test = createOutputFolder(outputTest, 'Traversy Media', 'React Front To Back', 1);

// console.log(test);



exports.createOutputFolderTest = (folderPath = process.cwd(), parent, course, season) => {
  console.log('Executing!');
  let output;
  let seasonN = padNumber(season);
  const parentFolder = path.join(folderPath, parent);
  const seasonFolder = path.join(folderPath, parent, `Season ${seasonN} - ${course}`)
  if (!fs.existsSync(parentFolder)) {
    fs.mkdirSync(parentFolder)
    console.log('Success Directory Created! 👍')
  } else {
    console.log('directory exists! 😐')
  }

  if (!fs.existsSync(seasonFolder)) {
    fs.mkdirSync(seasonFolder)
    output = seasonFolder;
  } else {
    const list = getDirectories(parentFolder);
    const numbers = list.map(item => parseInt(item.match(/\d/g)[1]))
    const last = numbers[numbers.length - 1] + 1;
    fs.mkdirSync(`${folderPath}/${parent}/Season ${padNumber(last)} - ${course}`)
    output = `${folderPath}/${parent}/Season ${padNumber(last)} - ${course}`;
  }

  return output;
}


const getFiles = exports.getFiles = (directory) => {
  const list = walkSync(directory).filter(item =>
    path.parse(item).ext !== '.mp4' &&
    path.parse(item).ext !== '.mkv' &&
    path.parse(item).ext !== '.srt');
  return list;
};

function moveFiles (inputFolder, outputFolder) {
  const list = getFiles(inputFolder);
  const filesFolder = path.join(outputFolder, '/Files')
  if ( list !== [] ) {
    // Make files folder
    fs.mkdirSync(filesFolder)

    list.forEach(item => {
      const name = path.parse(item).base
      const newPath = path.join(filesFolder, name);
      fs.copyFile(item, newPath, (err) => {
        if (err) throw err;
        console.log('File succesfully copied');
      });
    });

    const output = outputFolder;
    console.log(output);
    return list
  } 

  return console.log('No extra files found');
}

// const test = moveFiles('/mnt/e/temp/React For Beginners', '/mnt/e/temp/output/Wes Bos/Season 01 - React For Begginers')
// jsonPretty(test);