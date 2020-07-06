import React from "react";
import { useSelector } from "react-redux";

import { capitaliseFirst, getPowerIcon } from "app/utils";
import {
  controller as controllerSelectors,
  machine as machineSelectors,
  pod as podSelectors,
} from "app/base/selectors";
import type { RootState } from "app/store/root/types";
import DoubleRow from "app/base/components/DoubleRow";

type Props = { id: number };

const PowerColumn = ({ id }: Props): JSX.Element => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const hostDetails = useSelector((state: RootState) =>
    podSelectors.getHost(state, pod)
  );
  const machinesLoading = useSelector(machineSelectors.loading);
  const controllersLoading = useSelector(controllerSelectors.loading);
  const loading =
    pod.host && !hostDetails && (machinesLoading || controllersLoading);

  const iconClass = getPowerIcon(hostDetails, loading);

  let powerText = "Unknown";
  if (hostDetails && "power_state" in hostDetails) {
    powerText = capitaliseFirst(hostDetails.power_state);
  } else if (loading) {
    powerText = "";
  }

  return (
    <DoubleRow
      icon={<i className={iconClass}></i>}
      iconSpace
      primary={<span data-test="pod-power">{powerText}</span>}
    />
  );
};

export default PowerColumn;
