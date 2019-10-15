import status from "./status";

describe("status actions", () => {
  it("should handle logging in", () => {
    const payload = {
      username: "koala",
      password: "gumtree"
    };
    expect(status.login(payload)).toStrictEqual({ payload, type: "LOGIN" });
  });

  it("should handle checking if the user is authenticated", () => {
    expect(status.checkAuthenticated()).toStrictEqual({
      type: "CHECK_AUTHENTICATED"
    });
  });
});
