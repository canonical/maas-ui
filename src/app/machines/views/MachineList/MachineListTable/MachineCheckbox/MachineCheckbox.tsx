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
} from "app/store/machine/types";

type Props = {
  callId?: string | null;
  label: ReactNode;
  groupValue?: MachineStateListGroup["value"];
  systemId: Machine[MachineMeta.PK];
  machines?: Machine[];
};

const MachineCheckbox = ({
  callId,
  label,
  groupValue,
  systemId,
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
      onGenerateSelected={(checked) => {
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
