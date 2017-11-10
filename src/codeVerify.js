const codeGen = require('./codeGen.js');

function verifyCode() {
  const userCode = document.getElementById('userCode1').value;
  const found = false;
  if ((userCode === (secret))) {
  // if the code and user code are a match, send a alert
    util.log('You are correct this is the code');
  } else if (found === false) {
    util.log('Wrong code Please try again');
  // Send them an alert and let them know that they were incorrect
  }
}
