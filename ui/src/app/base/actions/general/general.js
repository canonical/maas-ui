const general = {};

/**
 * Generate a redux action creator for general websocket methods
 * @param {String} method - Name of the general websocket method
 * @returns {Function} Redux action creator for fetching general data
 */
const generateGeneralAction = (method) => () => ({
  type: `FETCH_GENERAL_${method.toUpperCase()}`,
  meta: {
    model: "general",
    method,
  },
});

general.fetchArchitectures = generateGeneralAction("architectures");
general.fetchComponentsToDisable = generateGeneralAction(
  "components_to_disable"
);
general.fetchDefaultMinHweKernel = generateGeneralAction(
  "default_min_hwe_kernel"
);
general.fetchDeprecationNotices = generateGeneralAction("deprecation_notices");
general.fetchHweKernels = generateGeneralAction("hwe_kernels");
general.fetchKnownArchitectures = generateGeneralAction("known_architectures");
general.fetchMachineActions = generateGeneralAction("machine_actions");
general.fetchNavigationOptions = generateGeneralAction("navigation_options");
general.fetchOsInfo = generateGeneralAction("osinfo");
general.fetchPocketsToDisable = generateGeneralAction("pockets_to_disable");
general.fetchPowerTypes = generateGeneralAction("power_types");
general.fetchVersion = generateGeneralAction("version");

export default general;
