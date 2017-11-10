// This is the code generator that will make the random code for user to type in.

function codeGen() {
  const length = 6;
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let newCode = '';

  for (i = 0, n = charset.length; i < length; i += 1) {
    newCode = charset.charAt(Math.floor(Math.random() * n));
  }
  return newCode;
}

// where the code will be stored we have to send this to the user to verify.
const secret = codeGen();

module.export.codeGen = codeGen;
