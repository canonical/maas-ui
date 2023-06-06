import { Notification, Button } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch } from "react-redux";

import { actions as machineActions } from "app/store/machine";
import { FilterMachines } from "app/store/machine/utils";

type Props = {
  filter: string;
  machineCount: number | null;
  selectedCount: number;
};

export const MachineListSelectedCount = ({
  filter,
  machineCount,
  selectedCount,
}: Props): JSX.Element => {
  const dispatch = useDispatch();

  return (
    <Notification borderless className="u-no-margin--bottom" title="Selection">
      {machineCount && selectedCount < machineCount ? (
        <>
          {selectedCount} {pluralize("machine", selectedCount)} selected.{" "}
          <Button
            appearance="link"
            onClick={() => {
              dispatch(
                machineActions.setSelectedMachines({
                  filter: FilterMachines.parseFetchFilters(filter),
                })
              );
            }}
          >
            {filter
              ? `Select all ${machineCount} filtered machines`
              : `Select all ${machineCount} machines`}
          </Button>
        </>
      ) : (
        <>
          Selected all {machineCount}
          {filter ? " filtered" : ""} machines.{" "}
          <Button
            appearance="link"
            onClick={() => {
              dispatch(machineActions.setSelectedMachines(null));
            }}
          >
            Clear selection
          </Button>
        </>
      )}
    </Notification>
  );
};

export default MachineListSelectedCount;
