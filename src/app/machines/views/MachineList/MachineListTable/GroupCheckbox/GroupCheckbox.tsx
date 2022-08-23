import cloneDeep from "clone-deep";
import { useSelector } from "react-redux";

import TableCheckbox from "app/machines/components/TableCheckbox";
import { Checked } from "app/machines/components/TableCheckbox/TableCheckbox";
import machineSelectors from "app/store/machine/selectors";
import type { MachineStateListGroup } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type Props = {
  callId?: string | null;
  groupName: MachineStateListGroup["name"];
};

const GroupCheckbox = ({ callId, groupName }: Props): JSX.Element => {
  const selected = useSelector(machineSelectors.selectedMachines);
  const group = useSelector((state: RootState) =>
    machineSelectors.listGroup(state, callId, groupName)
  );
  const allSelected = !!selected && "filter" in selected;
  // Whether this group is currently selected.
  const groupSelected =
    !!selected && "groups" in selected && selected.groups?.includes(groupName);
  // Whether some of the machines in the group are selected.
  const childrenSelected =
    !!selected &&
    "items" in selected &&
    !!selected.items?.find((selectedId) => group?.items.includes(selectedId));

  return (
    <TableCheckbox
      callId={callId}
      extraClasses="u-align-header-checkbox"
      inputLabel={<strong>{groupName}</strong>}
      isChecked={
        allSelected || groupSelected
          ? Checked.Checked
          : childrenSelected
          ? Checked.Mixed
          : Checked.Unchecked
      }
      isDisabled={group?.count === 0 || allSelected}
      onGenerateSelected={(checked) => {
        let newSelected =
          !selected || "filter" in selected
            ? { groups: [] }
            : cloneDeep(selected);
        newSelected.groups = newSelected.groups ?? [];

        if (checked && !newSelected.groups?.includes(groupName)) {
          // If the checkbox has been checked and the group is not in the list
          // then add it.
          newSelected.groups.push(groupName);
        } else if (!checked && newSelected.groups?.includes(groupName)) {
          // If the checkbox has been unchecked and the group is in the list
          // then remove it.
          newSelected.groups = newSelected.groups.filter(
            (selectedGroup) => selectedGroup !== groupName
          );
        }
        // Remove any individually selected machines that are in the group that has
        // just been selected
        if (selected && "items" in selected) {
          newSelected.items = selected.items?.filter(
            (systemId) => !group?.items.includes(systemId)
          );
        }
        return newSelected;
      }}
    />
  );
};

export default GroupCheckbox;
