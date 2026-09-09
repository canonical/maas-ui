import { actions } from "./slice";

describe("status actions", () => {
  it("should handle logging in", () => {
    const payload = {
      username: "koala",
      password: "gumtree",
    };
    expect(actions.login(payload)).toStrictEqual({
      type: "status/login",
      payload,
    });
  });

  it("should handle logging out", () => {
    expect(actions.logout()).toStrictEqual({
      type: "status/logout",
      payload: null,
    });
  });

  it("should handle checking if the user is authenticated", () => {
    expect(actions.checkAuthenticated()).toStrictEqual({
      type: "status/checkAuthenticated",
      payload: null,
    });
  });

  it("should handle connection to a WebSocket", () => {
    expect(actions.websocketConnect()).toEqual({
      type: "status/websocketConnect",
    });
  });
});
