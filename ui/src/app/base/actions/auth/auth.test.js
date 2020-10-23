import auth from "./auth";

describe("base actions", () => {
  it("creates an action for fetching the current user", () => {
    expect(auth.fetch()).toEqual({
      type: "FETCH_AUTH_USER",
      meta: {
        model: "user",
        method: "auth_user",
      },
    });
  });

  it("creates an action for changing a user's password", () => {
    expect(auth.changePassword({ password: "pass1" })).toEqual({
      type: "auth/changePassword",
      meta: {
        model: "user",
        method: "change_password",
      },
      payload: {
        params: { password: "pass1" },
      },
    });
  });

  it("creates an action for an admin changing a user's password", () => {
    expect(auth.changePassword({ password: "pass1" })).toEqual({
      type: "auth/adminChangePassword",
      meta: {
        model: "user",
        method: "admin_change_password",
      },
      payload: {
        params: { password: "pass1" },
      },
    });
  });

  it("creates an action for cleaning up", () => {
    expect(auth.cleanup()).toEqual({
      type: "auth/cleanup",
    });
  });
});
