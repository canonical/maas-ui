import { someInArray } from "./someInArray";

type CheckboxHandlers<ID> = {
  handleGroupCheckbox: (ids: ID[], selectedIDs: ID[]) => void;
  handleRowCheckbox: (rowID: ID, selectedIDs: ID[]) => void;
};

/**
 * Generate checkbox handlers for use in tables.
 * @param {(newSelectedIDs: ID[]) => void} onChange - the function to run with the new list of IDs
 * @returns {CheckboxHandlers} Checkbox handlers object
 */
export const generateCheckboxHandlers = <ID>(
  onChange: (newSelectedIDs: ID[]) => void
): CheckboxHandlers<ID> => ({
  // Handler to update a group of checkboxes (including all items in a table).
  handleGroupCheckbox: (ids, selectedIDs) => {
    // If some items in a group are already selected, remove all items in that group.
    // Otherwise add them to the selected array, without duplicates.
    const newSelectedIDs = someInArray(ids, selectedIDs)
      ? selectedIDs.filter((id) => !ids.includes(id))
      : selectedIDs.concat(ids.filter((id) => !selectedIDs.includes(id)));
    onChange(newSelectedIDs);
  },
  // Handler to update a single checkbox.
  handleRowCheckbox: (rowID, selectedIDs) => {
    // If the item is selected, unselect it and vice versa.
    const newSelectedIDs = someInArray(rowID, selectedIDs)
      ? selectedIDs.filter((id) => id !== rowID)
      : [...selectedIDs, rowID];
    onChange(newSelectedIDs);
  },
});
