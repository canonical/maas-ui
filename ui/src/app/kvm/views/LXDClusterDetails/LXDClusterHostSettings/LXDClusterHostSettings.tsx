import { useEffect } from "react";

import { Spinner, Strip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import LXDHostToolbar from "app/kvm/components/LXDHostToolbar";
import { actions as podActions } from "app/store/pod";
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
  const dispatch = useDispatch();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, hostId)
  );
  const loading = useSelector(podSelectors.loading);

  useEffect(() => {
    dispatch(podActions.get(hostId));
  }, [dispatch, hostId]);

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
