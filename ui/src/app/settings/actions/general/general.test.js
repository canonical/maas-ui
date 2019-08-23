import general from "./general";

describe("general actions", () => {
  it("should handle fetching components to disable", () => {
    expect(general.fetchComponentsToDisable()).toEqual({
      type: "FETCH_GENERAL_COMPONENTS_TO_DISABLE",
      meta: {
        model: "general",
        method: "components_to_disable"
      }
    });
  });

  it("should handle fetching known architectures", () => {
    expect(general.fetchKnownArchitectures()).toEqual({
      type: "FETCH_GENERAL_KNOWN_ARCHITECTURES",
      meta: {
        model: "general",
        method: "known_architectures"
      }
    });
  });

  it("should handle fetching osinfo", () => {
    expect(general.fetchOsInfo()).toEqual({
      type: "FETCH_GENERAL_OSINFO",
      meta: {
        model: "general",
        method: "osinfo"
      }
    });
  });

  it("should handle fetching pockets to disable", () => {
    expect(general.fetchPocketsToDisable()).toEqual({
      type: "FETCH_GENERAL_POCKETS_TO_DISABLE",
      meta: {
        model: "general",
        method: "pockets_to_disable"
      }
    });
  });
});
