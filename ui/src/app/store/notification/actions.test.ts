import { actions } from "./slice";

describe("notification actions", () => {
  it("returns a fetch action", () => {
    expect(actions.fetch()).toEqual({
      type: "notification/fetch",
      meta: {
        model: "notification",
        method: "list",
      },
      payload: null,
    });
  });

  it("returns a create action", () => {
    expect(actions.create({ message: "a notification" })).toEqual({
      type: "notification/create",
      meta: {
        model: "notification",
        method: "create",
      },
      payload: {
        params: {
          message: "a notification",
        },
      },
    });
  });

  it("returns an update action", () => {
    expect(actions.update({ message: "a notification" })).toEqual({
      type: "notification/update",
      meta: {
        model: "notification",
        method: "update",
      },
      payload: {
        params: {
          message: "a notification",
        },
      },
    });
  });

  it("creates a dismiss action", () => {
    expect(actions.dismiss(2)).toEqual({
      type: "notification/dismiss",
      payload: {
        params: {
          id: 2,
        },
      },
      meta: {
        method: "dismiss",
        model: "notification",
      },
    });
  });

  it("returns a cleanup action", () => {
    expect(actions.cleanup()).toEqual({
      type: "notification/cleanup",
      payload: undefined,
    });
  });
});
