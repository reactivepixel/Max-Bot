const fs = require('fs');
const util = require('apex-util');

module.exports = () => {
  const ctrls = [];
  const targetPath = './bot/controllers';
  const exts = ['js'];

  // const file = 'roles.js';
  fs.readdirSync(targetPath).forEach((file) => {
    // Skip Self Recursive Loading
    if (file === 'index.js') return false;

    // Split File name on "."
    const splitFile = file.split('.');

    // Isolate last position of the splitFile, it should be the File Ext
    const currentExt = splitFile[splitFile.length - 1];

    // Check if extension is on approved array
    if (exts.includes(currentExt)) {
      ctrls.push(require(`./${file}`));
      // import/no-dynamic-require
    }

    return true;
  });

  util.log('Return Controllers loaded within the target path of ' + targetPath, ctrls, 3);
  return ctrls;
};
