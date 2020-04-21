import general from "./general";

describe("general actions", () => {
  it("should handle fetching architectures", () => {
    expect(general.fetchArchitectures()).toEqual({
      type: "FETCH_GENERAL_ARCHITECTURES",
      meta: {
        model: "general",
        method: "architectures",
      },
    });
  });

  it("should handle fetching components to disable", () => {
    expect(general.fetchComponentsToDisable()).toEqual({
      type: "FETCH_GENERAL_COMPONENTS_TO_DISABLE",
      meta: {
        model: "general",
        method: "components_to_disable",
      },
    });
  });

  it("should handle fetching default min hwe kernel", () => {
    expect(general.fetchDefaultMinHweKernel()).toEqual({
      type: "FETCH_GENERAL_DEFAULT_MIN_HWE_KERNEL",
      meta: {
        model: "general",
        method: "default_min_hwe_kernel",
      },
    });
  });

  it("should handle fetching deprecationNotices", () => {
    expect(general.fetchDeprecationNotices()).toEqual({
      type: "FETCH_GENERAL_DEPRECATION_NOTICES",
      meta: {
        model: "general",
        method: "deprecation_notices",
      },
    });
  });

  it("should handle fetching hwe kernels", () => {
    expect(general.fetchHweKernels()).toEqual({
      type: "FETCH_GENERAL_HWE_KERNELS",
      meta: {
        model: "general",
        method: "hwe_kernels",
      },
    });
  });

  it("should handle fetching known architectures", () => {
    expect(general.fetchKnownArchitectures()).toEqual({
      type: "FETCH_GENERAL_KNOWN_ARCHITECTURES",
      meta: {
        model: "general",
        method: "known_architectures",
      },
    });
  });

  it("should handle fetching machine actions", () => {
    expect(general.fetchMachineActions()).toEqual({
      type: "FETCH_GENERAL_MACHINE_ACTIONS",
      meta: {
        model: "general",
        method: "machine_actions",
      },
    });
  });

  it("should handle fetching navigation options", () => {
    expect(general.fetchNavigationOptions()).toEqual({
      type: "FETCH_GENERAL_NAVIGATION_OPTIONS",
      meta: {
        model: "general",
        method: "navigation_options",
      },
    });
  });

  it("should handle fetching osinfo", () => {
    expect(general.fetchOsInfo()).toEqual({
      type: "FETCH_GENERAL_OSINFO",
      meta: {
        model: "general",
        method: "osinfo",
      },
    });
  });

  it("should handle fetching pockets to disable", () => {
    expect(general.fetchPocketsToDisable()).toEqual({
      type: "FETCH_GENERAL_POCKETS_TO_DISABLE",
      meta: {
        model: "general",
        method: "pockets_to_disable",
      },
    });
  });

  it("should handle fetching power types", () => {
    expect(general.fetchPowerTypes()).toEqual({
      type: "FETCH_GENERAL_POWER_TYPES",
      meta: {
        model: "general",
        method: "power_types",
      },
    });
  });

  it("should handle fetching version", () => {
    expect(general.fetchVersion()).toEqual({
      type: "FETCH_GENERAL_VERSION",
      meta: {
        model: "general",
        method: "version",
      },
    });
  });
});
