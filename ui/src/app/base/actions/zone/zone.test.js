import zone from "./zone";

describe("base actions", () => {
  it("should handle fetching zones", () => {
    expect(zone.fetch()).toEqual({
      type: "FETCH_ZONE",
      meta: {
        model: "zone",
        method: "list",
      },
    });
  });
});
