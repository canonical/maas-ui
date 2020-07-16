import type { RootState } from "app/store/root/types";
import type { Message } from "app/store/message/types";

/**
 * Get the global messages.
 * @param {RootState} state - The redux state.
 * @returns {Message[]} The list of messages.
 */
const all = (state: RootState): Message[] => state.messages.items;

const messages = { all };

export default messages;
