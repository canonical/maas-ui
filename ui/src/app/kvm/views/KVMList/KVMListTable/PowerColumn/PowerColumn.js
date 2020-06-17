import React from "react";
import { useSelector } from "react-redux";

import { capitaliseFirst, getPowerIcon } from "app/utils";
import {
  controller as controllerSelectors,
  machine as machineSelectors,
  pod as podSelectors,
} from "app/base/selectors";
import DoubleRow from "app/base/components/DoubleRow";

const PowerColumn = ({ id }) => {
  const pod = useSelector((state) => podSelectors.getById(state, id));
  const host = useSelector((state) => podSelectors.getHost(state, pod));
  const machinesLoading = useSelector(machineSelectors.loading);
  const controllersLoading = useSelector(controllerSelectors.loading);
  const loading = machinesLoading || controllersLoading;

  const iconClass = getPowerIcon(host, loading);

  let powerText = "Unknown";
  if (host && host.power_state) {
    powerText = capitaliseFirst(host.power_state);
  } else if (!host && loading) {
    powerText = "";
  }

  return (
    <DoubleRow
      icon={<i className={iconClass}></i>}
      iconSpace
      primary={
        <span className="u-nudge-right--small" data-test="pod-power">
          {powerText}
        </span>
      }
    />
  );
};

export default PowerColumn;
