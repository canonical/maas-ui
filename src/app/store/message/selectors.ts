import type { Message } from "app/store/message/types";
import type { RootState } from "app/store/root/types";

/**
 * Get the global messages.
 * @param {RootState} state - The redux state.
 * @returns {Message[]} The list of messages.
 */
const all = (state: RootState): Message[] => state.message.items;

const messages = { all };

export default messages;
