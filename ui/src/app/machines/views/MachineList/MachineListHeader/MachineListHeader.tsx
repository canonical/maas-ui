import { useEffect } from "react";

import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import AddHardwareMenu from "./AddHardwareMenu";

import SectionHeader from "app/base/components/SectionHeader";
import type { SetSearchFilter } from "app/base/types";
import MachineHeaderForms from "app/machines/components/MachineHeaderForms";
import TakeActionMenu from "app/machines/components/TakeActionMenu";
import type {
  MachineHeaderContent,
  MachineSetHeaderContent,
} from "app/machines/types";
import machineURLs from "app/machines/urls";
import { getHeaderTitle } from "app/machines/utils";
import poolsURLs from "app/pools/urls";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import resourcePoolSelectors from "app/store/resourcepool/selectors";

const getMachineCount = (
  machines: Machine[],
  selectedMachines: Machine[],
  setSearchFilter: SetSearchFilter
) => {
  const machineCountString = `${machines.length} ${pluralize(
    "machine",
    machines.length
  )}`;
  if (selectedMachines.length) {
    if (machines.length === selectedMachines.length) {
      return "All machines selected";
    }
    return (
      <Button
        className="p-button--link"
        onClick={() => setSearchFilter("in:(Selected)")}
      >
        {`${selectedMachines.length} of ${machineCountString} selected`}
      </Button>
    );
  }
  return `${machineCountString} available`;
};

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
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const selectedMachines = useSelector(machineSelectors.selected);

  useEffect(() => {
    dispatch(machineActions.fetch());
    dispatch(resourcePoolActions.fetch());
  }, [dispatch]);

  useEffect(() => {
    if (location.pathname !== machineURLs.machines.index) {
      setHeaderContent(null);
    }
  }, [location.pathname, setHeaderContent]);

  const getHeaderButtons = () => {
    if (location.pathname === machineURLs.machines.index) {
      return [
        <AddHardwareMenu
          disabled={selectedMachines.length > 0}
          key="add-hardware"
          setHeaderContent={setHeaderContent}
        />,
        <TakeActionMenu
          key="machine-list-action-menu"
          setHeaderContent={setHeaderContent}
        />,
      ];
    }
    if (location.pathname === poolsURLs.pools) {
      return [
        <Button data-test="add-pool" element={Link} to={poolsURLs.add}>
          Add pool
        </Button>,
      ];
    }
    return null;
  };

  return (
    <SectionHeader
      buttons={getHeaderButtons()}
      headerContent={
        headerContent && (
          <MachineHeaderForms
            headerContent={headerContent}
            setHeaderContent={setHeaderContent}
            setSearchFilter={setSearchFilter}
          />
        )
      }
      subtitle={getMachineCount(machines, selectedMachines, setSearchFilter)}
      subtitleLoading={!machinesLoaded}
      tabLinks={[
        {
          active: location.pathname.startsWith(machineURLs.machines.index),
          component: Link,
          label: `${pluralize("Machine", machines.length, true)}`,
          to: machineURLs.machines.index,
        },
        {
          active: location.pathname.startsWith(poolsURLs.pools),
          component: Link,
          label: `${pluralize("Resource pool", resourcePools.length, true)}`,
          to: poolsURLs.pools,
        },
      ]}
      title={getHeaderTitle("Machines", headerContent)}
    />
  );
};

export default MachineListHeader;
