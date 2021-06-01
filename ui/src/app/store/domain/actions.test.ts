import { actions } from "./slice";

describe("domain actions", () => {
  it("creates an action for fetching domains", () => {
    expect(actions.fetch()).toEqual({
      type: "domain/fetch",
      meta: {
        model: "domain",
        method: "list",
      },
      payload: null,
    });
  });

  it("creates an action for creating domains", () => {
    expect(actions.create({ name: "new domain" })).toEqual({
      type: "domain/create",
      meta: {
        model: "domain",
        method: "create",
      },
      payload: { params: { name: "new domain" } },
    });
  });

  it("creates an action for updating domains", () => {
    expect(actions.update({ id: 1, name: "updated domain" })).toEqual({
      type: "domain/update",
      meta: {
        model: "domain",
        method: "update",
      },
      payload: { params: { id: 1, name: "updated domain" } },
    });
  });
});
