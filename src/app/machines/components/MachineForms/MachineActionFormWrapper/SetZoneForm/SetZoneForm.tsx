import { useDispatch, useSelector } from "react-redux";

import { SetZoneForm as BaseSetZoneForm } from "@/app/base/components/node/SetZoneForm/SetZoneForm";
import { machineActions } from "@/app/store/machine";
import machineSelectors from "@/app/store/machine/selectors";
import type { MachineEventErrors } from "@/app/store/machine/types";
import { FilterMachines } from "@/app/store/machine/utils";
import {
  useMachineSelectedCount,
  useSelectedMachinesActionsDispatch,
} from "@/app/store/machine/utils/hooks";

type Props = {
  isViewingDetails: boolean;
};

const SetZoneForm = ({ isViewingDetails }: Props) => {
  const dispatch = useDispatch();
  const selectedMachines = useSelector(machineSelectors.selected);
  const searchFilter = FilterMachines.filtersToString(
    FilterMachines.queryStringToFilters(location.search)
  );
  const { selectedCount } = useMachineSelectedCount(
    FilterMachines.parseFetchFilters(searchFilter)
  );
  const {
    dispatch: dispatchForSelectedMachines,
    actionStatus,
    actionErrors,
  } = useSelectedMachinesActionsDispatch({ selectedMachines, searchFilter });
  return (
    <BaseSetZoneForm<MachineEventErrors>
      actionStatus={actionStatus}
      cleanup={machineActions.cleanup}
      errors={actionErrors}
      isViewingDetails={isViewingDetails}
      modelName="machine"
      onSubmit={(zoneID) => {
        dispatch(machineActions.cleanup());
        dispatchForSelectedMachines(machineActions.setZone, {
          zone_id: zoneID,
        });
      }}
      selectedCount={selectedCount}
    />
  );
};

export default SetZoneForm;
