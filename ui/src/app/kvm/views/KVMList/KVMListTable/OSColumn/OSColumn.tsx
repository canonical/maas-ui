import React from "react";
import { useSelector } from "react-redux";

import { getStatusText } from "app/utils";
import {
  controller as controllerSelectors,
  machine as machineSelectors,
  pod as podSelectors,
} from "app/base/selectors";
import type { RootState } from "app/store/root/types";
import generalSelectors from "app/store/general/selectors";
import DoubleRow from "app/base/components/DoubleRow";

type Props = { id: number };

const OSColumn = ({ id }: Props): JSX.Element | null => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const hostDetails = useSelector((state: RootState) =>
    podSelectors.getHost(state, pod)
  );
  const osReleases = useSelector((state: RootState) =>
    generalSelectors.osInfo.getOsReleases(
      state,
      hostDetails ? hostDetails.osystem : undefined
    )
  );
  const machinesLoading = useSelector(machineSelectors.loading);
  const controllersLoading = useSelector(controllerSelectors.loading);

  if (pod) {
    const loading =
      Boolean(pod.host) &&
      !hostDetails &&
      (machinesLoading || controllersLoading);

    let osText = "Unknown";
    if (hostDetails) {
      osText = getStatusText(hostDetails, osReleases);
    } else if (loading) {
      osText = "";
    }

    return (
      <DoubleRow
        icon={loading && <i className="p-icon--spinner u-animation--spin"></i>}
        iconSpace
        primary={<span data-test="pod-os">{osText}</span>}
      />
    );
  }
  return null;
};

export default OSColumn;
