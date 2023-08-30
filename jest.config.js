const jestConfig = {
    verbose: true,
    silent: true,
    testEnvironment: 'jsdom',
    testURL: "http://localhost/",
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
      "^.+\\.css$": "jest-css-modules-transform"
    },
    testMatch: ['**/__tests__/*.js?(x)'],
  }
  
  module.exports = jestConfig