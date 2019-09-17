import controller from "./controller";

describe("controller actions", () => {
  it("should handle fetching controllers", () => {
    expect(controller.fetch()).toEqual({
      type: "FETCH_CONTROLLER",
      meta: {
        model: "controller",
        method: "list"
      }
    });
  });
});
