import { actions } from "./slice";

describe("base actions", () => {
  it("creates an action for fetching zones", () => {
    expect(actions.fetch()).toEqual({
      type: "zone/fetch",
      meta: {
        model: "zone",
        method: "list",
      },
      payload: null,
    });
  });

  it("creates an action for fetching zones", () => {
    expect(
      actions.create({ name: "zone1", description: "It's the best zone" })
    ).toEqual({
      type: "zone/create",
      meta: {
        model: "zone",
        method: "create",
      },
      payload: { params: { name: "zone1", description: "It's the best zone" } },
    });
  });

  it("creates an action for fetching zones", () => {
    expect(
      actions.update({
        id: 1,
        name: "zone1",
        description: "It's the best zone",
      })
    ).toEqual({
      type: "zone/update",
      meta: {
        model: "zone",
        method: "update",
      },
      payload: {
        params: { id: 1, name: "zone1", description: "It's the best zone" },
      },
    });
  });
});
