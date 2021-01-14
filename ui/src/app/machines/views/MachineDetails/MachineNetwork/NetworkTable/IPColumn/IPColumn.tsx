import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import fabricSelectors from "app/store/fabric/selectors";
import machineSelectors from "app/store/machine/selectors";
import type {
  Machine,
  NetworkInterface,
  NetworkLink,
} from "app/store/machine/types";
import {
  getInterfaceDiscovered,
  getInterfaceFabric,
  getInterfaceIPAddressOrMode,
  getLinkInterface,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { actions as scriptResultActions } from "app/store/scriptresult";
import scriptResultsSelectors from "app/store/scriptresult/selectors";
import type { ScriptResult } from "app/store/scriptresult/types";
import vlanSelectors from "app/store/vlan/selectors";

/**
 * Get the text for the failed status.
 * @param nic - A network interface.
 * @param failedNetworkResults - The failed network testing results.
 * @return The display text for a link mode.
 */
const getNetworkTestingStatus = (
  nic: NetworkInterface | null | undefined,
  failedNetworkResults: ScriptResult[] | null
): string | null => {
  if (!nic || !failedNetworkResults?.length) {
    return null;
  }
  const failedTests = failedNetworkResults.filter(
    (result) => result.interface?.id === nic.id
  );
  if (failedTests.length > 1) {
    return `${failedTests.length} failed tests`;
  }
  if (failedTests.length === 1) {
    return `${failedTests[0].name} failed`;
  }
  return null;
};

type Props = {
  link?: NetworkLink | null;
  nic?: NetworkInterface | null;
  systemId: Machine["system_id"];
};

const IPColumn = ({ link, nic, systemId }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const [scriptResultsRequested, setScriptResultsRequested] = useState(false);
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const fabrics = useSelector(fabricSelectors.all);
  const vlans = useSelector(vlanSelectors.all);
  const failedNetworkResults = useSelector((state: RootState) =>
    scriptResultsSelectors.getNetworkTestingByMachineId(
      state,
      machine?.system_id,
      true
    )
  );
  if (link && !nic && machine) {
    [nic] = getLinkInterface(machine, link);
  }

  useEffect(() => {
    if (!scriptResultsRequested) {
      dispatch(scriptResultActions.getByMachineId(systemId));
      setScriptResultsRequested(true);
    }
  }, [dispatch, systemId, scriptResultsRequested]);

  if (!machine) {
    return null;
  }

  const fabric = getInterfaceFabric(machine, fabrics, vlans, nic, link);
  const discovered = getInterfaceDiscovered(machine, nic, link);

  return (
    <DoubleRow
      primary={getInterfaceIPAddressOrMode(machine, fabrics, vlans, nic, link)}
      secondary={
        fabric && !discovered?.ip_address
          ? getNetworkTestingStatus(nic, failedNetworkResults)
          : null
      }
    />
  );
};

export default IPColumn;
