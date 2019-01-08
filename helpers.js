const path = require('path');

exports.translateWinToWsl = (pathToTranslate) => {
  let sepa = pathToTranslate.split(path.win32.sep);
  let newS = [].concat([sepa[0].toLowerCase()], sepa.slice(1));
  let newP = "/mnt/" + path.posix.join.apply(path.posix, newS).replace(":", "");

  return newP;
}

exports.sanitizeName = (string) => {

};

exports.padNumber = (number) => {
  // check if input is string, if it isnt make it a tring
  if (typeof number !== 'string') {
    number = (number + '');
    console.log('now its a string');
  }

  const digits = number.split('');

  if (digits.length <= 1) {
    number = 0 + number;
  }
  return number;
}

function padNumber (number) {
  // check if input is string, if it isnt make it a tring
  if (typeof number !== 'string') {
    number = (number + '');
    console.log('now its a string');
  }

  const digits = number.split('');

  if (digits.length <= 1) {
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
  // Get only the numbers and remove leading zeros
  let trimmed = string.replace(/\b0+/g, "");
  const numb = padNumber(trimmed.match(/\d/g).join(''));
  // Sanitazed number

  // Get the string without any numbers
  const noNum = string.replace(/[0-9]/g, '').trim();
  // console.log(noNum.trim());


  const newString = `${noNum}`;

  return newString;
};