import { actions } from "./slice";

describe("user actions", () => {
  it("returns a fetch action", () => {
    expect(actions.fetch()).toEqual({
      type: "user/fetch",
      meta: {
        model: "user",
        method: "list",
      },
      payload: null,
    });
  });

  it("returns a create action", () => {
    expect(
      actions.create({
        username: "user1",
        email: "a@user.com",
        password1: "seCr3t",
        password2: "seCr3t",
      })
    ).toEqual({
      type: "user/create",
      meta: {
        model: "user",
        method: "create",
      },
      payload: {
        params: {
          username: "user1",
          email: "a@user.com",
          password1: "seCr3t",
          password2: "seCr3t",
        },
      },
    });
  });

  it("returns an update action", () => {
    expect(
      actions.update({ id: 1, username: "user1", email: "a@user.com" })
    ).toEqual({
      type: "user/update",
      meta: {
        model: "user",
        method: "update",
      },
      payload: {
        params: { id: 1, username: "user1", email: "a@user.com" },
      },
    });
  });

  it("returns a delete action", () => {
    expect(actions.delete(1)).toEqual({
      type: "user/delete",
      meta: {
        model: "user",
        method: "delete",
      },
      payload: {
        params: {
          id: 1,
        },
      },
    });
  });

  it("returns a cleanup action", () => {
    expect(actions.cleanup()).toEqual({
      type: "user/cleanup",
      payload: undefined,
    });
  });
});
