import React from "react";
import { useSelector } from "react-redux";

import { getStatusText } from "app/utils";
import {
  controller as controllerSelectors,
  general as generalSelectors,
  machine as machineSelectors,
  pod as podSelectors,
} from "app/base/selectors";
import type { RootState } from "app/store/root/types";
import DoubleRow from "app/base/components/DoubleRow";

type Props = { id: number };

const OSColumn = ({ id }: Props): JSX.Element => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const host = useSelector((state: RootState) =>
    podSelectors.getHost(state, pod)
  );
  const osReleases = useSelector((state: RootState) =>
    generalSelectors.osInfo.getOsReleases(state, host && host.osystem)
  );
  const machinesLoading = useSelector(machineSelectors.loading);
  const controllersLoading = useSelector(controllerSelectors.loading);
  const loading = machinesLoading || controllersLoading;

  let osText = "Unknown";
  if (host) {
    osText = getStatusText(host, osReleases);
  } else if (!host && loading) {
    osText = "";
  }

  return (
    <DoubleRow
      icon={
        !host &&
        loading && <i className="p-icon--spinner u-animation--spin"></i>
      }
      iconSpace
      primary={<span data-test="pod-os">{osText}</span>}
    />
  );
};

export default OSColumn;
