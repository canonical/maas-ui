import { actions } from "./slice";

import { NodeActions } from "app/store/types/node";

describe("controller actions", () => {
  it("should handle fetching controllers", () => {
    expect(actions.fetch()).toEqual({
      type: "controller/fetch",
      meta: {
        model: "controller",
        method: "list",
      },
      payload: null,
    });
  });

  it("should handle creating controllers", () => {
    expect(
      actions.create({
        description: "a controller",
      })
    ).toEqual({
      type: "controller/create",
      meta: {
        model: "controller",
        method: "create",
      },
      payload: {
        params: {
          description: "a controller",
        },
      },
    });
  });

  it("should handle updating controllers", () => {
    expect(
      actions.update({
        system_id: "abc123",
        description: "an updated controller",
      })
    ).toEqual({
      type: "controller/update",
      meta: {
        model: "controller",
        method: "update",
      },
      payload: {
        params: {
          system_id: "abc123",
          description: "an updated controller",
        },
      },
    });
  });

  it("can get a controller", () => {
    expect(actions.get("abc123")).toEqual({
      type: "controller/get",
      meta: {
        model: "controller",
        method: "get",
      },
      payload: {
        params: { system_id: "abc123" },
      },
    });
  });

  it("can set an active controller", () => {
    expect(actions.setActive("abc123")).toEqual({
      type: "controller/setActive",
      meta: {
        model: "controller",
        method: "set_active",
      },
      payload: {
        params: { system_id: "abc123" },
      },
    });
  });

  it("can handle deleting a controller", () => {
    expect(actions.delete("abc123")).toEqual({
      type: "controller/delete",
      meta: {
        model: "controller",
        method: "action",
      },
      payload: {
        params: {
          action: NodeActions.DELETE,
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle setting selected controllers", () => {
    expect(actions.setSelected(["abc123", "def456"])).toEqual({
      type: "controller/setSelected",
      payload: ["abc123", "def456"],
    });
  });
});
