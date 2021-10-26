import { Strip } from "@canonical/react-components";

import DangerZoneCard from "../../LXDSingleDetails/LXDSingleSettings/DangerZoneCard";

import type { KVMSetHeaderContent } from "app/kvm/types";
import type { VMCluster } from "app/store/vmcluster/types";

type Props = {
  clusterId: VMCluster["id"];
  setHeaderContent: KVMSetHeaderContent;
};

const LXDClusterSettings = ({
  clusterId,
  setHeaderContent,
}: Props): JSX.Element => {
  return (
    <Strip className="u-no-padding--top" shallow>
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
