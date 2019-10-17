const config = {
  moduleDirectories: [
    '<rootDir>/src/app/',
    'node_modules'
  ],
  moduleNameMapper: {
    '.scss$': '<rootDir>/src/app/testing/proxy-module.js'
  },
  setupFiles: [
    '<rootDir>/src/app/testing/setup-jest.js',
  ],
  setupFilesAfterEnv: [
    '../node_modules/jquery/dist/jquery.js',
    '../node_modules/angular/angular.js',
    '../node_modules/angular-route/angular-route.js',
    '../node_modules/angular-mocks/angular-mocks.js',
    '../node_modules/angular-cookies/angular-cookies.js',
    '../node_modules/angular-sanitize/angular-sanitize.js',
    '<rootDir>/src/app/entry.js',
    '<rootDir>/src/app/testing/setup.js',

  ],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testMatch: [
    '<rootDir>/src/app/*/tests/test_*.js'
  ],
  testURL: 'http://example.com:8000/',
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.html?$': 'html-loader-jest'
  },
};

module.exports = config;
