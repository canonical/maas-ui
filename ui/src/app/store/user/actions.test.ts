import { actions } from "./slice";

import { user as userFactory } from "testing/factories";

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
    const user = userFactory({ username: "user1", email: "a@user.com" });
    expect(actions.create(user)).toEqual({
      type: "user/create",
      meta: {
        model: "user",
        method: "create",
      },
      payload: {
        params: user,
      },
    });
  });

  it("returns an update action", () => {
    const user = userFactory({ username: "user1", email: "a@user.com" });
    expect(actions.update(user)).toEqual({
      type: "user/update",
      meta: {
        model: "user",
        method: "update",
      },
      payload: {
        params: user,
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
