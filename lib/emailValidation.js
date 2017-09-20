exports.validateFullSailEmail = (string) => {
  let state = false;
  const email = string.search(/^[^-\s][a-zA-Z0-9_\-.#:]+@fullsail.?(com|edu)$(.*)/g);
  email !== -1 ? state = true : null;
  return state;
};
