import { useCallback } from "react";

/**
 * Create a callback for toggling the menu
 * @param {Function} onToggleMenu - The function to toggle the menu.
 * @param {String} systemId - The machine id.
 * @returns {Function} The toggle callback.
 */
export const useToggleMenu = (onToggleMenu, systemId) => {
  return useCallback((open) => onToggleMenu(systemId, open), [
    onToggleMenu,
    systemId,
  ]);
};
