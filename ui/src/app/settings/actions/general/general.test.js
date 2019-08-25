import general from "./general";

describe("general actions", () => {
  it("should handle fetching osinfo", () => {
    expect(general.fetchOsInfo()).toEqual({
      type: "FETCH_GENERAL_OSINFO",
      meta: {
        model: "general",
        method: "osinfo"
      }
    });
  });
});
