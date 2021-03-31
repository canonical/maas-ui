import { actions } from "./slice";

describe("base actions", () => {
  it("creates an action for fetching the current user", () => {
    expect(actions.fetch()).toEqual({
      type: "auth/fetch",
      meta: {
        model: "user",
        method: "auth_user",
      },
      payload: null,
    });
  });

  it("creates an action for changing a user's password", () => {
    expect(
      actions.changePassword({
        old_password: "oldpass",
        new_password1: "pass1",
        new_password2: "pass2",
      })
    ).toEqual({
      type: "auth/changePassword",
      meta: {
        model: "user",
        method: "change_password",
      },
      payload: {
        params: {
          old_password: "oldpass",
          new_password1: "pass1",
          new_password2: "pass2",
        },
      },
    });
  });

  it("creates an action for an admin changing a user's password", () => {
    expect(
      actions.adminChangePassword({ password1: "pass1", password2: "pass2" })
    ).toEqual({
      type: "auth/adminChangePassword",
      meta: {
        model: "user",
        method: "admin_change_password",
      },
      payload: {
        params: { password1: "pass1", password2: "pass2" },
      },
    });
  });

  it("creates an action for cleaning up", () => {
    expect(actions.cleanup()).toEqual({
      type: "auth/cleanup",
    });
  });
});
