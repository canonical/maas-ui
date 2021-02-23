import auth from "./auth";

describe("base actions", () => {
  it("should handle fetching the current user", () => {
    expect(auth.fetch()).toEqual({
      type: "FETCH_AUTH_USER",
      meta: {
        model: "user",
        method: "auth_user",
      },
    });
  });

  it("should handle changing the password", () => {
    expect(auth.changePassword({ password: "pass1" })).toEqual({
      type: "CHANGE_AUTH_USER_PASSWORD",
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
    expect(auth.adminChangePassword({ password: "pass1" })).toEqual({
      type: "ADMIN_CHANGE_USER_PASSWORD",
      meta: {
        model: "user",
        method: "admin_change_password",
      },
      payload: {
        params: { password: "pass1" },
      },
    });
  });

  it("should handle cleaning up", () => {
    expect(auth.cleanup()).toEqual({
      type: "CLEANUP_AUTH_USER",
    });
  });
});
