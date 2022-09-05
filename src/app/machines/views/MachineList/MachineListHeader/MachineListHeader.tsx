import { useCallback, useEffect } from "react";

import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useStorageState } from "react-storage-hooks";

import AddHardwareMenu from "./AddHardwareMenu";

import ModelListSubtitle from "app/base/components/ModelListSubtitle";
import NodeActionMenu from "app/base/components/NodeActionMenu";
import MachinesHeader from "app/base/components/node/MachinesHeader";
import type { SetSearchFilter } from "app/base/types";
import urls from "app/base/urls";
import MachineHeaderForms from "app/machines/components/MachineHeaderForms";
import { MachineHeaderViews } from "app/machines/constants";
import type {
  MachineHeaderContent,
  MachineSetHeaderContent,
} from "app/machines/types";
import { getHeaderTitle } from "app/machines/utils";
import machineSelectors from "app/store/machine/selectors";
import {
  useFetchMachineCount,
  useHasSelection,
} from "app/store/machine/utils/hooks";
import { NodeActions } from "app/store/types/node";
import { getNodeActionTitle } from "app/store/utils";

type Props = {
  headerContent: MachineHeaderContent | null;
  setSearchFilter: SetSearchFilter;
  setHeaderContent: MachineSetHeaderContent;
};

export const MachineListHeader = ({
  headerContent,
  setSearchFilter,
  setHeaderContent,
}: Props): JSX.Element => {
  const location = useLocation();
  const selectedMachines = useSelector(machineSelectors.selected);
  const hasSelection = useHasSelection();
  const [tagsSeen, setTagsSeen] = useStorageState(
    localStorage,
    "machineViewTagsSeen",
    false
  );
  const { machineCount, machineCountLoading } = useFetchMachineCount();

  useEffect(() => {
    if (location.pathname !== urls.machines.index) {
      setHeaderContent(null);
    }
  }, [location.pathname, setHeaderContent]);

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
          setHeaderContent={setHeaderContent}
        />,
        <NodeActionMenu
          alwaysShowLifecycle
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
              setHeaderContent({ view });
            }
          }}
        />,
      ]}
      headerContent={
        headerContent && (
          <MachineHeaderForms
            headerContent={headerContent}
            machines={selectedMachines}
            setHeaderContent={setHeaderContent}
            setSearchFilter={setSearchFilter}
          />
        )
      }
      subtitle={
        <ModelListSubtitle
          available={machineCount}
          filterSelected={() => setSearchFilter("in:(Selected)")}
          modelName="machine"
          selected={selectedMachines.length}
        />
      }
      subtitleLoading={machineCountLoading}
      title={getHeaderTitle("Machines", headerContent)}
    />
  );
};

export default MachineListHeader;
