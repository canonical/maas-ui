import scripts from "./scripts";

describe("scripts actions", () => {
  it("should handle fetching scripts", () => {
    expect(scripts.fetch()).toEqual({
      type: "FETCH_SCRIPTS"
    });
  });
});
