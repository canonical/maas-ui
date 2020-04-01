import service from "./service";

describe("service actions", () => {
  it("should handle fetching services", () => {
    expect(service.fetch()).toEqual({
      type: "FETCH_SERVICE",
      meta: {
        model: "service",
        method: "list",
      },
    });
  });
});
