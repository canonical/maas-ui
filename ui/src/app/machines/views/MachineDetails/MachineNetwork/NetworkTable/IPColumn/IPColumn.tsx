import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import machineSelectors from "app/store/machine/selectors";
import type {
  Machine,
  NetworkInterface,
  NetworkLink,
} from "app/store/machine/types";
import { getLinkInterface, getLinkModeDisplay } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { actions as scriptResultActions } from "app/store/scriptresult";
import scriptResultsSelectors from "app/store/scriptresult/selectors";
import type { ScriptResult } from "app/store/scriptresult/types";
import subnetSelectors from "app/store/subnet/selectors";

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
  const subnet = useSelector((state: RootState) =>
    subnetSelectors.getById(state, link?.subnet_id)
  );
  const discovered =
    nic?.discovered?.length && nic.discovered.length > 0
      ? nic.discovered[0]
      : null;

  useEffect(() => {
    if (!scriptResultsRequested) {
      dispatch(scriptResultActions.getByMachineId(systemId));
      setScriptResultsRequested(true);
    }
  }, [dispatch, systemId, scriptResultsRequested]);

  let primary: ReactNode = null;
  if (subnet && discovered?.ip_address) {
    primary = discovered.ip_address;
  } else if (!discovered?.ip_address) {
    primary = link?.ip_address || getLinkModeDisplay(link);
  }

  return (
    <DoubleRow
      primary={primary}
      secondary={
        subnet && !discovered?.ip_address
          ? getNetworkTestingStatus(nic, failedNetworkResults)
          : null
      }
    />
  );
};

export default IPColumn;
