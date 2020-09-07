import { actions } from "./";

describe("device actions", () => {
  it("should handle fetching devices", () => {
    expect(actions.fetch()).toEqual({
      type: "device/fetch",
      meta: {
        model: "device",
        method: "list",
      },
      payload: null,
    });
  });
});
