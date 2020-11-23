import React from "react";
import { useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import controllerSelectors from "app/store/controller/selectors";
import machineSelectors from "app/store/machine/selectors";
import { useFormattedOS } from "app/store/machine/utils";
import podSelectors from "app/store/pod/selectors";
import { getStatusText } from "app/utils";

import type { RootState } from "app/store/root/types";

type Props = { id: number };

const OSColumn = ({ id }: Props): JSX.Element | null => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const hostDetails = useSelector((state: RootState) =>
    podSelectors.getHost(state, pod)
  );
  const machinesLoading = useSelector(machineSelectors.loading);
  const controllersLoading = useSelector(controllerSelectors.loading);
  const formattedOS = useFormattedOS(hostDetails);

  if (pod) {
    const loading =
      Boolean(pod.host) &&
      !hostDetails &&
      (machinesLoading || controllersLoading);

    let osText = "Unknown";
    if (hostDetails) {
      osText = getStatusText(hostDetails, formattedOS);
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
