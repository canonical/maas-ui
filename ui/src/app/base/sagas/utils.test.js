import getCookie from "./utils";

describe("saga utils", () => {
  it("returns undefined if a cookie is not found", () => {
    expect(getCookie("foo")).toEqual(undefined);
  });

  it("returns the value of a cookie by name", () => {
    Object.defineProperty(document, "cookie", {
      get: jest.fn().mockImplementation(() => {
        return "a=foo; b=bar; c=baz";
      }),
    });

    expect(getCookie("b")).toEqual("bar");
  });
});
