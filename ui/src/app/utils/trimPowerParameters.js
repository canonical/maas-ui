/**
 * React expects controlled inputs to have some associated state. Because the
 * power parameters are dynamic and dependent on what power type is selected,
 * the form is initialised with all possible power parameters from all power
 * types. Before the create machine action is dispatched, the power parameters
 * are trimmed to only those relevant to the selected power type.
 *
 * @param {Object} powerType - selected power type
 * @param {Object} powerParameters - all power parameters entered in Formik form
 * @returns {Object} power parameters relevant to selected power type
 */
export const trimPowerParameters = (powerType, powerParameters) => {
  const trimmedParameters = {};
  if (powerType && powerType.fields) {
    powerType.fields.forEach((field) => {
      trimmedParameters[field.name] = powerParameters[field.name];
    });
  }
  return trimmedParameters;
};
