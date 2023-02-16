import type { ReactNode } from "react";

import cloneDeep from "clone-deep";
import { useSelector } from "react-redux";

import TableCheckbox from "app/machines/components/TableCheckbox";
import { Checked } from "app/machines/components/TableCheckbox/TableCheckbox";
import machineSelectors from "app/store/machine/selectors";
import type {
  Machine,
  MachineMeta,
  MachineStateListGroup,
  SelectedMachines,
} from "app/store/machine/types";

type Props = {
  callId?: string | null;
  label: ReactNode;
  groupValue?: MachineStateListGroup["value"];
  systemId: Machine[MachineMeta.PK];
  machines?: Machine[];
};

const rangeSelectMachines = ({
  systemId,
  checked,
  machines,
  selected,
}: {
  systemId: string;
  checked: boolean;
  machines: Machine[];
  selected: SelectedMachines | null;
}) => {
  let newSelected =
    !selected || "filter" in selected ? { items: [] } : cloneDeep(selected);
  newSelected.items = newSelected.items ?? [];

  if (!checked && newSelected.items.includes(systemId)) {
    // could just be an innocent 'deselect'
    newSelected.items = newSelected.items.filter(
      (selectedId) => selectedId !== systemId
    );
    return newSelected;
  }

  const previousChecked = newSelected.items.at(-1);
  if (!previousChecked) {
    // if there's no previous selected item, select the clicked item
    newSelected.items.push(systemId);
    return newSelected;
  }
  const currentIndex = machines.findIndex(
    (machine) => machine.system_id === systemId
  );
  const previousIndex = machines.findIndex(
    (machine) => machine.system_id === previousChecked
  );

  // Get the start and end points of the selected range
  const startIndex = Math.min(currentIndex, previousIndex);
  const endIndex = Math.max(currentIndex, previousIndex);

  // Check if the resulting indexes make a valid range for selection
  if (startIndex > -1 && endIndex > -1 && checked) {
    // loop through the machine list, add the ids that have not been added already
    for (let i = startIndex; i <= endIndex; i++) {
      if (newSelected.items.includes(machines[i].system_id)) {
        continue;
      } else {
        newSelected.items.push(machines[i].system_id);
      }
    }
  }

  return newSelected;
};

const MachineCheckbox = ({
  callId,
  label,
  groupValue,
  systemId,
  machines,
}: Props): JSX.Element => {
  const selected = useSelector(machineSelectors.selectedMachines);
  const allSelected = !!selected && "filter" in selected;
  // Whether the group this machine appears in is selected.
  const groupSelected =
    typeof groupValue !== "undefined" &&
    groupValue !== null &&
    !!selected &&
    "groups" in selected &&
    selected.groups?.includes(groupValue);
  // Display this machine as checked if it or the machine's group or all
  // machines are selected.
  const isChecked =
    allSelected ||
    groupSelected ||
    (!!selected && "items" in selected && !!selected.items?.includes(systemId));

  return (
    <TableCheckbox
      callId={callId}
      inputLabel={label}
      isChecked={isChecked ? Checked.Checked : Checked.Unchecked}
      isDisabled={allSelected || groupSelected}
      onGenerateSelected={(checked, event) => {
        window.getSelection()?.removeAllRanges();
        // @ts-ignore shiftKey is usually defined when using click events
        if (event?.nativeEvent.shiftKey && !groupValue) {
          return rangeSelectMachines({
            systemId,
            checked,
            machines: machines ?? [],
            selected,
          });
        }

        let newSelected =
          !selected || "filter" in selected
            ? { items: [] }
            : cloneDeep(selected);
        newSelected.items = newSelected.items ?? [];
        if (checked && !newSelected.items?.includes(systemId)) {
          // If the checkbox has been checked and the system ID is not in the list
          // then add it.
          newSelected.items.push(systemId);
        } else if (!checked && newSelected.items?.includes(systemId)) {
          // If the checkbox has been unchecked and the system ID is in the list
          // then remove it.
          newSelected.items = newSelected.items.filter(
            (selectedId) => selectedId !== systemId
          );
        }
        return newSelected;
      }}
    />
  );
};

export default MachineCheckbox;
