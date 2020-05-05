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
 * @returns {Object} power parameters relevant to selected power type
 */

const chassisParameterMap = new Map([
  ["power_address", "hostname"],
  ["power_pass", "password"],
  ["power_port", "port"],
  ["power_protocol", "protocol"],
  ["power_user", "username"],
]);

export const formatPowerParameters = (
  powerType,
  powerParameters,
  chassis = false
) => {
  const formattedParameters = {};
  if (powerType && powerType.fields) {
    powerType.fields.forEach((field) => {
      if (chassis) {
        if (field.scope !== "node") {
          const fieldName =
            (chassis && chassisParameterMap.get(field.name)) || field.name;
          formattedParameters[fieldName] = powerParameters[field.name];
        }
      } else {
        formattedParameters[field.name] = powerParameters[field.name];
      }
    });
  }
  return formattedParameters;
};
