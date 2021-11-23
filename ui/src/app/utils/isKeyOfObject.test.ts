import { isKeyOfObject } from "./isKeyOfObject";

describe("isKeyOfObject", () => {
  it("handles a string that is a valid key", () => {
    expect(isKeyOfObject("validKey", { validKey: "yep" })).toBe(true);
  });

  it("handles a string that is an invalid key", () => {
    expect(isKeyOfObject("invalidKey" as string, { validKey: "nope" })).toBe(
      false
    );
  });
});
