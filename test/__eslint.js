const lint = require('mocha-eslint');

// Array of paths to lint
// Note: a seperate Mocha test will be run for each path and each file which
// matches a glob pattern
const paths = [
  'bot',
  'test/**/*.js',
];

const options = {
  // Specify style of output
  // Defaults to `stylish`
  formatter: 'compact',

  // Only display warnings if a test is failing
  // Defaults to `true`, always show warnings
  alwaysWarn: true,

  // Increase the timeout of the test if linting takes to long
  // Defaults to the global mocha `timeout` option
  timeout: 5000,

  // Increase the time until a test is marked as slow
  // Defaults to the global mocha `slow` option
  slow: 2000,

  // Consider linting warnings as errors and return failure
  // Defaults to `false`, only notify the warnings
  strict: true,

  // Specify the mocha context in which to run tests
  // Defaults to `eslint`, but can be any string
  contextName: 'AirBnB Style Guide Adhearance - eslint',
};

// Run the tests
lint(paths, options);
