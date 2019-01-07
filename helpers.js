const path = require('path');

exports.translateWinToWsl = (pathToTranslate) => {
  let sepa = pathToTranslate.split(path.win32.sep);
  let newS = [].concat([sepa[0].toLowerCase()], sepa.slice(1));
  let newP = "/mnt/" + path.posix.join.apply(path.posix, newS).replace(":", "");

  return newP;
}

