function codeGen() {
  const length = 6;
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let newCode = '';

  for (i = 0, n = charset.length; i < length; i += 1) {
    newCode = charset.charAt(Math.floor(Math.random() * n));
  }
  return newCode;
}

const secret = codeGen();

module.export.codeGen = codeGen;
