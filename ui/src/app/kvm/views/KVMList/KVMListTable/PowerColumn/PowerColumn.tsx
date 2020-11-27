import { useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import controllerSelectors from "app/store/controller/selectors";
import machineSelectors from "app/store/machine/selectors";
import podSelectors from "app/store/pod/selectors";
import type { RootState } from "app/store/root/types";
import { capitaliseFirst, getPowerIcon } from "app/utils";

type Props = { id: number };

const PowerColumn = ({ id }: Props): JSX.Element | null => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const hostDetails = useSelector((state: RootState) =>
    podSelectors.getHost(state, pod)
  );
  const machinesLoading = useSelector(machineSelectors.loading);
  const controllersLoading = useSelector(controllerSelectors.loading);

  if (pod) {
    const loading =
      Boolean(pod.host) &&
      !hostDetails &&
      (machinesLoading || controllersLoading);

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
  }
  return null;
};

export default PowerColumn;
