const config = {
  snapshotSerializers: ["enzyme-to-json/serializer"],
  setupFilesAfterEnv: ["<rootDir>/setup-jest.js"],
};

module.exports = config;
