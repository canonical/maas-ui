import status from "./status";

describe("status actions", () => {
  it("should handle logging in", () => {
    const payload = {
      username: "koala",
      password: "gumtree"
    };
    expect(status.login(payload)).toStrictEqual({ payload, type: "LOGIN" });
  });

  it("should handle logging out", () => {
    expect(status.logout()).toStrictEqual({
      type: "LOGOUT"
    });
  });

  it("should handle checking if the user is authenticated", () => {
    expect(status.checkAuthenticated()).toStrictEqual({
      type: "CHECK_AUTHENTICATED"
    });
  });

  it("should handle external log in", () => {
    expect(status.externalLogin()).toStrictEqual({ type: "EXTERNAL_LOGIN" });
  });

  it("should handle storing the external login URL", () => {
    const payload = {
      url: "http://login.example.com"
    };
    expect(status.externalLoginURL(payload)).toStrictEqual({
      payload,
      type: "EXTERNAL_LOGIN_URL"
    });
  });
});
