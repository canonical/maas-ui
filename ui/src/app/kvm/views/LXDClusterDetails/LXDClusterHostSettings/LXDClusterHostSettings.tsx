import { Spinner, Strip } from "@canonical/react-components";
import { useSelector } from "react-redux";

import LXDHostToolbar from "app/kvm/components/LXDHostToolbar";
import { useActivePod } from "app/kvm/hooks";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import { isPodDetails } from "app/store/pod/utils";
import type { RootState } from "app/store/root/types";
import type { VMCluster } from "app/store/vmcluster/types";

type Props = {
  clusterId: VMCluster["id"];
  hostId: Pod["id"];
};

const LXDClusterHostSettings = ({ clusterId, hostId }: Props): JSX.Element => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, hostId)
  );
  const loading = useSelector(podSelectors.loading);
  useActivePod(hostId);

  console.log("pod", pod);
  console.log("isPodDetails(pod)", isPodDetails(pod));

  if (loading || !isPodDetails(pod)) {
    return <Spinner text="Loading..." />;
  }
  return (
    <Strip className="u-no-padding--top" shallow>
      <LXDHostToolbar clusterId={clusterId} hostId={hostId} showBasic />
    </Strip>
  );
};

export default LXDClusterHostSettings;
