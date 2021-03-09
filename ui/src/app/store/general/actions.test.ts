import { actions as general } from "./slice";

describe("general actions", () => {
  it("should handle fetching architectures", () => {
    expect(general.fetchArchitectures()).toEqual({
      type: "general/fetchArchitectures",
      meta: {
        model: "general",
        method: "architectures",
      },
      payload: null,
    });
  });

  it("should handle fetching bond options", () => {
    expect(general.fetchBondOptions()).toEqual({
      type: "general/fetchBondOptions",
      meta: {
        model: "general",
        method: "bond_options",
      },
      payload: null,
    });
  });

  it("should handle fetching components to disable", () => {
    expect(general.fetchComponentsToDisable()).toEqual({
      type: "general/fetchComponentsToDisable",
      meta: {
        model: "general",
        method: "components_to_disable",
      },
      payload: null,
    });
  });

  it("should handle fetching default min hwe kernel", () => {
    expect(general.fetchDefaultMinHweKernel()).toEqual({
      type: "general/fetchDefaultMinHweKernel",
      meta: {
        model: "general",
        method: "default_min_hwe_kernel",
      },
      payload: null,
    });
  });

  it("should handle fetching hwe kernels", () => {
    expect(general.fetchHweKernels()).toEqual({
      type: "general/fetchHweKernels",
      meta: {
        model: "general",
        method: "hwe_kernels",
      },
      payload: null,
    });
  });

  it("should handle fetching known architectures", () => {
    expect(general.fetchKnownArchitectures()).toEqual({
      type: "general/fetchKnownArchitectures",
      meta: {
        model: "general",
        method: "known_architectures",
      },
      payload: null,
    });
  });

  it("should handle fetching machine actions", () => {
    expect(general.fetchMachineActions()).toEqual({
      type: "general/fetchMachineActions",
      meta: {
        model: "general",
        method: "machine_actions",
      },
      payload: null,
    });
  });

  it("should handle fetching navigation options", () => {
    expect(general.fetchNavigationOptions()).toEqual({
      type: "general/fetchNavigationOptions",
      meta: {
        model: "general",
        method: "navigation_options",
      },
      payload: null,
    });
  });

  it("should handle fetching osinfo", () => {
    expect(general.fetchOsInfo()).toEqual({
      type: "general/fetchOsInfo",
      meta: {
        model: "general",
        method: "osinfo",
      },
      payload: null,
    });
  });

  it("should handle fetching pockets to disable", () => {
    expect(general.fetchPocketsToDisable()).toEqual({
      type: "general/fetchPocketsToDisable",
      meta: {
        model: "general",
        method: "pockets_to_disable",
      },
      payload: null,
    });
  });

  it("should handle fetching power types", () => {
    expect(general.fetchPowerTypes()).toEqual({
      type: "general/fetchPowerTypes",
      meta: {
        model: "general",
        method: "power_types",
      },
      payload: null,
    });
  });

  it("should handle fetching version", () => {
    expect(general.fetchVersion()).toEqual({
      type: "general/fetchVersion",
      meta: {
        model: "general",
        method: "version",
      },
      payload: null,
    });
  });
});
