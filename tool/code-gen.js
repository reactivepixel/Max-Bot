exports.codeGen = (codeLength) => {
  let emailCode = '';
  const emailCodeSource = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';

  for (let genLoopIndex = 0; genLoopIndex < codeLength; genLoopIndex += 1) {
    // Add a random letter to the urlString
    emailCode += emailCodeSource.charAt(Math.random() * (emailCodeSource.length - 1));
  }

  return emailCode;
};
