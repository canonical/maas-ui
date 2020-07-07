import type { RootState } from "app/store/root/types";
import type { TSFixMe } from "app/base/types";

/**
 * Get the global messages.
 * @param {Object} state - The redux state.
 * @returns {Array} The list of messages.
 */
const all = (state: RootState): TSFixMe => state.messages.items;

const messages = { all };

export default messages;
