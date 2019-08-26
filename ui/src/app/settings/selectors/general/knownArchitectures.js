const knownArchitectures = {};

/**
 * Returns list of all known architectures, usable or not
 * @param {Object} state - Redux state
 * @returns {Array} Components to disable
 */
knownArchitectures.get = state => state.general.knownArchitectures.data;

/**
 * Returns true if known architectures are loading
 * @param {Object} state - Redux state
 * @returns {Boolean} Known architectures are loading
 */
knownArchitectures.loading = state => state.general.knownArchitectures.loading;

/**
 * Returns true if known architectures have loaded
 * @param {Object} state - Redux state
 * @returns {Boolean} Known architectures have loaded
 */
knownArchitectures.loaded = state => state.general.knownArchitectures.loaded;

export default knownArchitectures;
