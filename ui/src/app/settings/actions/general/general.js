const general = {};

/**
 * Generate a redux action creator for general websocket methods
 * @param {String} method - Name of the general websocket method
 * @returns {Function} Redux action creator for fetching general data
 */
const generateGeneralAction = method => () => ({
  type: `FETCH_GENERAL_${method.toUpperCase()}`,
  meta: {
    model: "general",
    method
  }
});

general.fetchComponentsToDisable = generateGeneralAction(
  "components_to_disable"
);
general.fetchKnownArchitectures = generateGeneralAction("known_architectures");
general.fetchOsInfo = generateGeneralAction("osinfo");
general.fetchPocketsToDisable = generateGeneralAction("pockets_to_disable");

export default general;
