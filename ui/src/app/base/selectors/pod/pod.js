const pod = {};

/**
 * Returns all pods.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all pods.
 */
pod.all = (state) => state.pod.items;

/**
 * Whether pods are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Machines loading state.
 */
pod.loading = (state) => state.pod.loading;

/**
 * Whether pods have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Machines loaded state.
 */
pod.loaded = (state) => state.pod.loaded;

/**
 * Get the pod saving state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether pods are being saved.
 */
pod.saving = (state) => state.pod.saving;

/**
 * Get the pod saved state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether pods have been saved.
 */
pod.saved = (state) => state.pod.saved;

/**
 * Returns pod errors.
 * @param {Object} state - The redux state.
 * @returns {Object} Machine errors state.
 */
pod.errors = (state) => state.pod.errors;

export default pod;
