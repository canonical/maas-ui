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
});
