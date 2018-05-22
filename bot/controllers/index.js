const fs = require('fs');
const util = require('apex-util');

module.exports = () => {
  const controllers = [];
  const targetPath = './bot/controllers';
  const validExtensions = ['js'];

  // Auto-load controller files
  fs.readdirSync(targetPath).forEach((file) => {
    // Skip self-recursive loading
    if (file === 'index.js') return false;

    // Split File name on "."
    const splitFile = file.split('.');

    // Isolate last position of the splitFile, it should be the File Ext
    const currentExt = splitFile[splitFile.length - 1];

    // Check if extension is on approved array
    if (validExtensions.includes(currentExt)) {
      // Add controller to list
      controllers.push(require(`./${file}`));
    }
    return true;
  });

  util.log('Controllers found within target path' + targetPath, controllers, 3);
  return controllers;
};
