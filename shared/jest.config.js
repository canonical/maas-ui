const config = {
  snapshotSerializers: ["enzyme-to-json/serializer"],
  setupFilesAfterEnv: ["<rootDir>/setup-jest.js"],
  testEnvironment: "jsdom",
};

module.exports = config;
