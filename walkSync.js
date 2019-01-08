const fs = require('fs');
const path = require('path');

const flatten = arr => arr.reduce((acc, val) =>
  acc.concat(Array.isArray(val) ? flatten(val) : val), []);
Array.prototype.flatten = function () { return flatten(this) };

const walkSync = dir => fs.readdirSync(dir)
  .map(file => fs.statSync(path.join(dir, file)).isDirectory()
    ? walkSync(path.join(dir, file))
    : path.join(dir, file).replace(/\\/g, '/')).flatten();

const listItems = (dir) => {

  const result = [];

  const filtered = walkSync(dir).filter(item => (path.parse(item).ext === '.mp4' || path.parse(item).ext === '.mkv'));

  filtered.forEach(item => {
    const data = {
      fullPath: path.join(path.parse(item).dir, '/', path.parse(item).base).replace(/\\/g, '/'),
      folderPath: path.parse(item).dir,
      folderName: path.parse(item).dir.split('/').pop(),
      extname: path.parse(item).ext,
      filename: path.parse(item).name,
      fullname: path.parse(item).base
    };
    result.push(data);
  });

  return result;
};

const items = listItems(process.cwd());

console.log(items.length + 1);