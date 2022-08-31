import { useSelector } from "react-redux";

import TableCheckbox from "app/machines/components/TableCheckbox";
import { Checked } from "app/machines/components/TableCheckbox/TableCheckbox";
import machineSelectors from "app/store/machine/selectors";
import type { FetchFilters } from "app/store/machine/types";

export enum Label {
  Name = "All machines",
}

type Props = {
  callId?: string | null;
  filter?: FetchFilters | null;
};

const AllCheckbox = ({ callId, filter }: Props): JSX.Element => {
  const selected = useSelector(machineSelectors.selectedMachines);
  // A filter exists in the selected state when all machines in the current
  // table are selected.
  const allSelected = !!selected && "filter" in selected;
  const someSelected =
    !!selected &&
    (("items" in selected && !!selected.items?.length) ||
      ("groups" in selected && !!selected.groups?.length));

  return (
    <TableCheckbox
      aria-label={Label.Name}
      // Remove the labelled-by attribute so that the aria-label is used.
      aria-labelledby=""
      callId={callId}
      isChecked={
        allSelected
          ? Checked.Checked
          : someSelected
          ? Checked.Mixed
          : Checked.Unchecked
      }
      onGenerateSelected={(checked) => (checked && filter ? { filter } : null)}
    />
  );
};

export default AllCheckbox;
