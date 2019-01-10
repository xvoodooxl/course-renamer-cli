const path = require('path');
const fs = require('fs');

exports.translateWinToWsl = (pathToTranslate) => {
  let sepa = pathToTranslate.split(path.win32.sep);
  let newS = [].concat([sepa[0].toLowerCase()], sepa.slice(1));
  let newP = "/mnt/" + path.posix.join.apply(path.posix, newS).replace(":", "");

  return newP;
}

/**
 * Find all files inside a dir, recursively.
 * @function padNumber
 * @param  {string} number Number to pad
 * @param  {string} digits Amount of digits the number has to be padded default = 1
 * @param  {string} amount Amount of zeros to add in front default = 1
 * @return {array[]} Array with all file names that are inside the directory.
 */

exports.padNumber = (number, digitsToPad = 1) => {
  // check if input is string, if it isnt make it a tring
  if (typeof number !== 'string') {
    number = (number + '');
  }
  
  const digits = number.split('');
  if (digits.length <= digitsToPad) {
    number = 0 + number;
  }
  return number;
}


exports.sanitizeString = (string) => {
  // Remove dots or underscores  
  string = string.replace(/720|1080/g, " ");
  string = string.replace(/\./g, "");
  // Remove Underscores
  string = string.replace(/\_|\-/g, " ");
  const noNum = string.replace(/[0-9]/g, '').trim();
  const newString = `${noNum}`;

  return newString;
};


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