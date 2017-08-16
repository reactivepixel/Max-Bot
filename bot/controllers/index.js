const fs = require('fs');
const util = require('apex-util');

module.exports = () => {
  let ctrls = [];
  const targetPath = './bot/controllers';
  const exts = ['js'];

  // const file = 'roles.js';
  fs.readdirSync(targetPath).forEach(file => {

    // Skip Self Recursive Loading
    if(file === 'index.js') return false;

    // Split File name on "."
    let splitFile = file.split('.');

    // Isolate last position of the splitFile, it should be the File Ext
    let currentExt = splitFile[splitFile.length - 1];

    // Check if extension is on approved array
    if(exts.includes(currentExt)){
      ctrls.push(require('./' + file));
    }

    return true;
  })

  util.log('Return Controllers loaded within the target path of ' + targetPath, ctrls, 3)
  return ctrls;
}
