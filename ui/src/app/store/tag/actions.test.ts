import { actions } from "./slice";

describe("tag actions", () => {
  it("returns an action for fetching tags", () => {
    expect(actions.fetch()).toEqual({
      type: "tag/fetch",
      meta: {
        model: "tag",
        method: "list",
      },
      payload: null,
    });
  });
});
