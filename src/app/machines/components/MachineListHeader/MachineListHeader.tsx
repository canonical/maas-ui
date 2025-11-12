import { useCallback } from "react";

import { useDispatch } from "react-redux";

import type { useResponsiveColumns } from "../../views/MachinesList/hooks";
import MachineListControls from "../MachineListControls";

import { usePoolCount } from "@/app/api/query/pools";
import type { SetSearchFilter } from "@/app/base/types";
import type { MachineSetSidePanelContent } from "@/app/machines/types";
import { machineActions } from "@/app/store/machine";
import type { FetchGroupKey } from "@/app/store/machine/types";
import { useFetchMachineCount } from "@/app/store/machine/utils/hooks";

type Props = {
  grouping: FetchGroupKey | null;
  hiddenColumns?: ReturnType<typeof useResponsiveColumns>[0];
  setGrouping: (group: FetchGroupKey | null) => void;
  setHiddenGroups: (groups: string[]) => void;
  setHiddenColumns: ReturnType<typeof useResponsiveColumns>[1];
  searchFilter: string;
  setSearchFilter: SetSearchFilter;
  setSidePanelContent: MachineSetSidePanelContent;
};

export const MachineListHeader = ({
  grouping,
  hiddenColumns = [],
  setGrouping,
  setHiddenGroups,
  setHiddenColumns,
  searchFilter,
  setSearchFilter,
  setSidePanelContent,
}: Props): React.ReactElement => {
  const dispatch = useDispatch();
  // Get the count of all machines
  const { machineCount: allMachineCount } = useFetchMachineCount();

  const resourcePoolsCount = usePoolCount();

  const handleSetSearchFilter = useCallback(
    (filter: string) => {
      setSearchFilter(filter);
      // clear selected machines on filters change
      // we cannot reliably preserve the selected state for groups of machines
      // as we are only fetching information about a group from the back-end
      // and the contents of a group may change when different filters are applied
      dispatch(machineActions.setSelected(null));
    },
    [dispatch, setSearchFilter]
  );

  return (
    <MachineListControls
      filter={searchFilter}
      grouping={grouping}
      hiddenColumns={hiddenColumns}
      machineCount={allMachineCount}
      resourcePoolsCount={resourcePoolsCount.data ?? 0}
      setFilter={handleSetSearchFilter}
      setGrouping={setGrouping}
      setHiddenColumns={setHiddenColumns}
      setHiddenGroups={setHiddenGroups}
      setSidePanelContent={setSidePanelContent}
    />
  );
};

export default MachineListHeader;
