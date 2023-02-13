import { useCallback, useEffect } from "react";

import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";
import { Link, useMatch } from "react-router-dom-v5-compat";
import { useStorageState } from "react-storage-hooks";

import AddHardwareMenu from "./AddHardwareMenu";

import NodeActionMenu from "app/base/components/NodeActionMenu";
import MachinesHeader from "app/base/components/node/MachinesHeader";
import { useSendAnalytics } from "app/base/hooks";
import type { SetSearchFilter } from "app/base/types";
import urls from "app/base/urls";
import MachineHeaderForms from "app/machines/components/MachineHeaderForms";
import { MachineHeaderViews } from "app/machines/constants";
import type {
  MachineSidePanelContent,
  MachineSetSidePanelContent,
} from "app/machines/types";
import { getHeaderTitle } from "app/machines/utils";
import machineSelectors from "app/store/machine/selectors";
import { FilterMachines, selectedToFilters } from "app/store/machine/utils";
import {
  useFetchMachineCount,
  useHasSelection,
  useMachineSelectedCount,
} from "app/store/machine/utils/hooks";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import { NodeActions } from "app/store/types/node";
import { getNodeActionTitle } from "app/store/utils";

type Props = {
  sidePanelContent: MachineSidePanelContent | null;
  searchFilter: string;
  setSearchFilter: SetSearchFilter;
  setSidePanelContent: MachineSetSidePanelContent;
};

export const MachineListHeader = ({
  sidePanelContent,
  searchFilter,
  setSearchFilter,
  setSidePanelContent,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const machinesPathMatch = useMatch(urls.machines.index);
  const hasSelection = useHasSelection();
  const [tagsSeen, setTagsSeen] = useStorageState(
    localStorage,
    "machineViewTagsSeen",
    false
  );
  const filter = FilterMachines.parseFetchFilters(searchFilter);
  // Get the count of all machines
  const { machineCount: allMachineCount } = useFetchMachineCount();
  // Get the count of selected machines that match the current filter
  const { selectedCount, selectedCountLoading } =
    useMachineSelectedCount(filter);
  const selectedMachines = useSelector(machineSelectors.selectedMachines);
  const sendAnalytics = useSendAnalytics();

  // Clear the header when there are no selected machines
  useEffect(() => {
    if (!machinesPathMatch || selectedToFilters(selectedMachines) === null) {
      setSidePanelContent(null);
    }
  }, [machinesPathMatch, selectedMachines, setSidePanelContent]);

  useEffect(() => {
    dispatch(resourcePoolActions.fetch());
  }, [dispatch]);

  const resourcePools = useSelector(resourcePoolSelectors.all);

  const getTitle = useCallback(
    (action: NodeActions) => {
      if (action === NodeActions.TAG) {
        const title = getNodeActionTitle(action);
        if (!tagsSeen) {
          return (
            <>
              {title} <i className="p-text--small">(NEW)</i>
            </>
          );
        }
        return title;
      }
      return null;
    },
    [tagsSeen]
  );

  return (
    <MachinesHeader
      buttons={[
        <AddHardwareMenu
          disabled={hasSelection}
          key="add-hardware"
          setSidePanelContent={setSidePanelContent}
        />,
        <NodeActionMenu
          alwaysShowLifecycle
          excludeActions={[NodeActions.IMPORT_IMAGES]}
          getTitle={getTitle}
          hasSelection={hasSelection}
          key="machine-list-action-menu"
          nodeDisplay="machine"
          onActionClick={(action) => {
            if (action === NodeActions.TAG && !tagsSeen) {
              setTagsSeen(true);
            }
            const view = Object.values(MachineHeaderViews).find(
              ([, actionName]) => actionName === action
            );
            if (view) {
              setSidePanelContent({ view });
            }
            sendAnalytics(
              "Machine list action form",
              getNodeActionTitle(action),
              "Open"
            );
          }}
        />,
      ]}
      machineCount={allMachineCount}
      sidePanelContent={
        sidePanelContent && (
          <MachineHeaderForms
            searchFilter={searchFilter}
            selectedCount={selectedCount}
            selectedCountLoading={selectedCountLoading}
            selectedMachines={selectedMachines}
            setSearchFilter={setSearchFilter}
            setSidePanelContent={setSidePanelContent}
            sidePanelContent={sidePanelContent}
          />
        )
      }
      sidePanelTitle={getHeaderTitle("Machines", sidePanelContent)}
      subtitleLoading={selectedCountLoading}
      title={
        <>
          {allMachineCount} machines in{" "}
          <Link to={urls.pools.index}>
            {resourcePools.length} {pluralize("pool", resourcePools.length)}
          </Link>
        </>
      }
    />
  );
};

export default MachineListHeader;
