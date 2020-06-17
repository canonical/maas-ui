/**
 * Returns the correct icon given a machine's power status.
 * @param {Object} machine - the machine who's power you are checking.
 * @param {Boolean} loading - whether the data is still loading.
 * @returns {String} icon class
 */
export const getPowerIcon = (machine, loading) => {
  if (loading && !machine) {
    return "p-icon--spinner u-animation--spin";
  }
  if (machine && machine.power_state) {
    return `p-icon--power-${machine.power_state}`;
  }
  return "p-icon--power-unknown";
};
