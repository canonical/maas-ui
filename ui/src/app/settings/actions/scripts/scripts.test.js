import scripts from "./scripts";

describe("scripts actions", () => {
  it("should handle fetching scripts", () => {
    expect(scripts.fetch()).toEqual({
      type: "FETCH_SCRIPTS"
    });
  });

  it("can handle deleting scripts", () => {
    expect(scripts.delete("script-1")).toEqual({
      type: "DELETE_SCRIPT",
      payload: {
        name: "script-1"
      }
    });
  });

  it("can handle cleaning scripts", () => {
    expect(scripts.cleanup()).toEqual({
      type: "CLEANUP_SCRIPTS"
    });
  });
});
