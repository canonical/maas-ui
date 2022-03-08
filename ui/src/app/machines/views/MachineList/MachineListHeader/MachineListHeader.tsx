import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import AddHardwareMenu from "./AddHardwareMenu";

import ModelListSubtitle from "app/base/components/ModelListSubtitle";
import NodeActionMenu from "app/base/components/NodeActionMenu";
import MachinesHeader from "app/base/components/node/MachinesHeader";
import type { SetSearchFilter } from "app/base/types";
import MachineHeaderForms from "app/machines/components/MachineHeaderForms";
import { MachineHeaderViews } from "app/machines/constants";
import type {
  MachineHeaderContent,
  MachineSetHeaderContent,
} from "app/machines/types";
import machineURLs from "app/machines/urls";
import { getHeaderTitle } from "app/machines/utils";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";

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
  const dispatch = useDispatch();
  const location = useLocation();
  const machines = useSelector(machineSelectors.all);
  const machinesLoaded = useSelector(machineSelectors.loaded);
  const selectedMachines = useSelector(machineSelectors.selected);

  useEffect(() => {
    dispatch(machineActions.fetch());
  }, [dispatch]);

  useEffect(() => {
    if (location.pathname !== machineURLs.machines.index) {
      setHeaderContent(null);
    }
  }, [location.pathname, setHeaderContent]);

  return (
    <MachinesHeader
      buttons={[
        <AddHardwareMenu
          disabled={selectedMachines.length > 0}
          key="add-hardware"
          setHeaderContent={setHeaderContent}
        />,
        <NodeActionMenu
          alwaysShowLifecycle
          key="machine-list-action-menu"
          nodeDisplay="machine"
          nodes={selectedMachines}
          onActionClick={(action) => {
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
      subtitleLoading={!machinesLoaded}
      subtitle={
        <ModelListSubtitle
          available={machines.length}
          filterSelected={() => setSearchFilter("in:(Selected)")}
          modelName="machine"
          selected={selectedMachines.length}
        />
      }
      title={getHeaderTitle("Machines", headerContent)}
    />
  );
};

export default MachineListHeader;
