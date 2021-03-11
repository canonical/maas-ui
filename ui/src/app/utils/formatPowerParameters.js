/**
 * Formats power parameters by what is expected by the api. Also, React expects
 * controlled inputs to have some associated state. Because the power parameters
 * are dynamic and dependent on what power type is selected, the form is
 * initialised with all possible power parameters from all power types. Before
 * the action is dispatched, the power parameters are trimmed to only those
 * relevant to the selected power type.
 *
 * @param {Object} powerType - selected power type
 * @param {Object} powerParameters - all power parameters entered in Formik form
 * @param {String} driverType - power driver type, "chassis" | "node" | "pod"
 * @returns {Object} power parameters relevant to selected power type
 */

const chassisParameterMap = new Map([
  ["power_address", "hostname"],
  ["power_pass", "password"],
  ["power_port", "port"],
  ["power_protocol", "protocol"],
  ["power_token_name", "token_name"],
  ["power_token_secret", "token_secret"],
  ["power_user", "username"],
  ["power_verify_ssl", "verify_ssl"],
]);

export const formatPowerParameters = (
  powerType,
  powerParameters,
  driverType = "node"
) => {
  const formattedParameters = {};
  if (powerType && powerType.fields) {
    powerType.fields.forEach((field) => {
      if (
        driverType === "node" ||
        (driverType === "pod" && field.scope !== "node")
      ) {
        formattedParameters[field.name] = powerParameters[field.name];
      } else if (driverType === "chassis" && field.scope !== "node") {
        const fieldName = chassisParameterMap.get(field.name);
        formattedParameters[fieldName] = powerParameters[field.name];
      }
    });
  }
  return formattedParameters;
};
