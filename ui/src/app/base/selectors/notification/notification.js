const notification = {};

/**
 * Returns all notifications.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all notifications.
 */
notification.all = state => state.notification.items;

/**
 * Whether notifications are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Notifications are loading.
 */
notification.loading = state => state.notification.loading;

/**
 * Whether notifications have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Notifications have loaded.
 */
notification.loaded = state => state.notification.loaded;

/**
 * Returns a notification for the given id.
 * @param {Object} state - The redux state.
 * @returns {Array} A notification.
 */
notification.getById = (state, id) =>
  state.notification.items.find(notification => notification.id === id);

/**
 * Returns notifications of type 'warning'
 * @param {Object} state - The redux state.
 * @returns {Array} A notification.
 */
notification.warnings = state =>
  state.notification.items.filter(
    notification => notification.category === "warning"
  );

/**
 * Returns notifications of type 'error'
 * @param {Object} state - The redux state.
 * @returns {Array} A notification.
 */
notification.errors = state =>
  state.notification.items.filter(
    notification => notification.category === "error"
  );

/**
 * Returns notifications of type 'success'
 * @param {Object} state - The redux state.
 * @returns {Array} A notification.
 */
notification.success = state =>
  state.notification.items.filter(
    notification => notification.category === "success"
  );

/**
 * Returns notifications of type 'info'
 * @param {Object} state - The redux state.
 * @returns {Array} A notification.
 */
notification.info = state =>
  state.notification.items.filter(
    notification => notification.category === "info"
  );

export default notification;
