import cloneDeep from "clone-deep";

import type {
  FetchFilters,
  MachineStateListGroup,
  SelectedMachines,
} from "@/app/store/machine/types";

/**
 * Generate SelectedMachines for all machines across all pages
 * @param checked - if it should return selected state
 * @param filter - applied filter
 */
export const generateSelectedAll = ({
  checked,
  filter,
}: {
  checked: boolean;
  filter: FetchFilters | null;
}): { filter: FetchFilters } | null => {
  // A filter exists in the selected state when all machines in the current
  // table are selected.
  return checked && filter ? { filter } : null;
};

/**
 * Generate selected machines for the current page
 * @param {groups: MachineStateListGroup[]}  - machine groups that belong to the current page
 * @return {SelectedMachines} selected machines.
 */
export const generateSelectedOnCurrentPage = ({
  selected,
  groups,
}: {
  selected: SelectedMachines | null;
  groups: MachineStateListGroup[];
}): SelectedMachines => {
  const newSelected =
    !selected || "filter" in selected
      ? { groups: [] }
      : (cloneDeep(selected) ?? {});
  // Use sets so that selecting the current page again doesn't add machines or
  // groups that are already selected.
  const selectedGroups = new Set(newSelected.groups ?? []);
  const selectedItems = new Set(newSelected.items ?? []);
  groups?.forEach((group) => {
    if (group.collapsed) {
      // add all collapsed groups on the current page
      selectedGroups.add(group.value);
    } else {
      // add all machine items for each expanded group
      group.items.forEach((item) => {
        selectedItems.add(item);
      });
    }
  });
  newSelected.groups = [...selectedGroups];
  newSelected.items = [...selectedItems];
  return newSelected;
};
