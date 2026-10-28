import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch } from "react-redux";

import { machineActions } from "@/app/store/machine";
import { FilterMachines } from "@/app/store/machine/utils";

type Props = {
  filter: string;
  machineCount: number | null;
  selectedCount: number;
};

export const MachineListSelectedCount = ({
  filter,
  machineCount,
  selectedCount,
}: Props): React.ReactElement => {
  const dispatch = useDispatch();
  const total = machineCount ?? 0;

  if (selectedCount >= total) {
    return (
      <span className="u-text--muted">
        All {pluralize("machine", total, true)} selected
      </span>
    );
  }

  return (
    <span className="u-text--muted">
      {selectedCount} of {pluralize("machine", total, true)} selected.{" "}
      <Button
        appearance="link"
        className="u-no-margin--bottom u-no-padding"
        onClick={() => {
          dispatch(
            machineActions.setSelected({
              filter: FilterMachines.parseFetchFilters(filter),
            })
          );
        }}
      >
        Select all
      </Button>
    </span>
  );
};

export default MachineListSelectedCount;
