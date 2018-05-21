const fs = require('fs');
const util = require('apex-util');

module.exports = () => {
  const events = [];
  const targetPath = './bot/events';
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
      events.push(require(`./${file}`));
    }
    return true;
  });

  util.log('Events found within target path' + targetPath, events, 3);
  return events;
};
