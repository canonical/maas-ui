import domain from "./domain";

describe("domain actions", () => {
  it("should handle fetching domains", () => {
    expect(domain.fetch()).toEqual({
      type: "FETCH_DOMAIN",
      meta: {
        model: "domain",
        method: "list",
      },
    });
  });
});
