const toolkit = jest.requireActual("@reduxjs/toolkit");

module.exports = {
  ...toolkit,
  nanoid: jest.fn().mockReturnValue("Uakgb_J5m9g-0JDMbcJqLJ"),
};
