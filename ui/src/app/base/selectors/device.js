const device = {};

/**
 * Returns all devices.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all devices.
 */
device.all = state => state.device.items;

/**
 * Whether devices are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Devices loading state.
 */
device.loading = state => state.device.loading;

/**
 * Whether devices have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Devices loaded state.
 */
device.loaded = state => state.device.loaded;

/**
 * Returns a device for the given id.
 * @param {Object} state - The redux state.
 * @returns {Array} A device.
 */
device.getBySystemId = (state, id) =>
  state.device.items.find(device => device.system_id === id);

export default device;
