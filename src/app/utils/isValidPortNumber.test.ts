import { isValidPortNumber } from ".";

it("returns true for any number between 0 and 65535", () => {
  for (let i = 0; i <= 65535; i++) {
    expect(isValidPortNumber(i)).toBe(true);
  }
});

it("returns false for numbers larger than 65535", () => {
  expect(isValidPortNumber(65536)).toBe(false);
});

it("returns false for numbers smaller than 0", () => {
  expect(isValidPortNumber(-1)).toBe(false);
});
