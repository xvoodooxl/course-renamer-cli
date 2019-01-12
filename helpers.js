const path = require('path');
const fs = require('fs');
const prettyJson = require('prettyjson');

exports.translateWinToWsl = (pathToTranslate) => {
  let sepa = pathToTranslate.split(path.win32.sep);
  let newS = [].concat([sepa[0].toLowerCase()], sepa.slice(1));
  let newP = "/mnt/" + path.posix.join.apply(path.posix, newS).replace(":", "");

  return newP;
}

/**
 * Pad numbers with leading zeros for sorting 
 * @function padNumber
 * @param  {string} number Number to pad
 * @param  {string} digitsToPad Amount of digits the number has to be padded default = 1
 * @param  {string} amount Amount of zeros to add in front default = 1
 * @return {array[]} Array with all file names that are inside the directory.
 */

const padNumber = exports.padNumber = (number, digitsToPad = 2) => {
  // check if input is string, if it isnt make it a tring
  let output = number + '';

  while (output.length < digitsToPad) {
    output = '0' + output;
  }

  return output;
}

const sanitizeString = exports.sanitizeString = (string) => {
  subStr1 = string.slice(0, 8).replace(/[0-9\_\-\.]/g, '').trim();
  subStr2 = string.slice(8)

  const newString = `${subStr1}${subStr2}`;

  return newString;
};

/**
 * Find all files inside a directory
 * @function walkSync
 * @param  {string} dir Path to directory to be parsed
 * @return {array[]} Returns an array with al files
 */

exports.walkSync = (dir) => {
  const flatten = arr => arr.reduce((acc, val) =>
    acc.concat(Array.isArray(val) ? flatten(val) : val), []);

  Array.prototype.flatten = function () { return flatten(this) };

  const walk = dir => fs.readdirSync(dir)
    .map(file => fs.statSync(path.join(dir, file)).isDirectory()
      ? walk(path.join(dir, file))
      : path.join(dir, file).replace(/\\/g, '/')).flatten();

  return walk(dir);
}

/**
 * Find subtitle files that match the video file provided
 * @function getSubtitle
 * @param  {string} pathToFile Path to the video file in where to find the matches
 * @return {string} String containing the first subtitle match
 */

exports.getSubtitle = (pathToFile) => {
  let subtitlePath = null;

  const { dir, name } = path.parse(pathToFile);

  const basePath = path.join(dir, name).replace(/\\/g, '/');
  const ext = '.srt'
  const lang = ['', '-en', '.en', '.es', '-es', '-eng', '.eng', '-spa', '.spa'];

  for (let i = 0; i <= lang.length; i++) {
    if (fs.existsSync(`${basePath}${lang[i]}${ext}`)) {
      return subtitlePath = `${basePath}${lang[i]}${ext}`
    }
  }

  return subtitlePath;
}

exports.folderSortOrder = (string) => {
  // console.log(string);
  // const substring = ;
  let numb = string.slice(0, 5).match(/\d/g).join('');
  const folder = sanitizeString(string);
  numb = padNumber(numb, 3);

  const newName = `${numb}. ${folder}`
  return newName;
}

exports.getDirectories = (directory) => {
  const isDirectory = fileName => {
    return fs.lstatSync(fileName).isDirectory();
  }

  return fs.readdirSync(directory).map(fileName => {
    return path.join(directory, fileName)
  }).filter(isDirectory);
};

exports.jsonPretty = (data) => {
  const options = {
    keysColor: 'yellow',
    dashColor: 'magenta',
    stringColor: 'white',
    numberColor: 'white',
  }

  return console.log(prettyJson.render(data, options))
};