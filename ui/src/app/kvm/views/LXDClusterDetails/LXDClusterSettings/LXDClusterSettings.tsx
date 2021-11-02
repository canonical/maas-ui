import { Strip } from "@canonical/react-components";
import { useSelector } from "react-redux";

import { useActivePod } from "app/kvm/hooks";
import type { KVMSetHeaderContent } from "app/kvm/types";
import AuthenticationCard from "app/kvm/views/LXDSingleDetails/LXDSingleSettings/AuthenticationCard";
import DangerZoneCard from "app/kvm/views/LXDSingleDetails/LXDSingleSettings/DangerZoneCard";
import type { RootState } from "app/store/root/types";
import vmClusterSelectors from "app/store/vmcluster/selectors";
import type { VMCluster } from "app/store/vmcluster/types";

type Props = {
  clusterId: VMCluster["id"];
  setHeaderContent: KVMSetHeaderContent;
};

const LXDClusterSettings = ({
  clusterId,
  setHeaderContent,
}: Props): JSX.Element => {
  const cluster = useSelector((state: RootState) =>
    vmClusterSelectors.getById(state, clusterId)
  );
  useActivePod(cluster?.hosts[0]?.id || null);

  return (
    <Strip shallow>
      <AuthenticationCard
        hostId={cluster?.hosts[0]?.id || null}
        objectName={cluster?.name || null}
      />
      <DangerZoneCard
        clusterId={clusterId}
        message={
          <>
            <p>
              <strong>Remove this LXD cluster</strong>
            </p>
            <p>
              All VM hosts in this LXD cluster will be removed, you can still
              access this project from the LXD server.
            </p>
          </>
        }
        setHeaderContent={setHeaderContent}
      />
    </Strip>
  );
};

export default LXDClusterSettings;
