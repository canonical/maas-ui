import { useSelector } from "react-redux";

import LXDClusterHostsTable from "./LXDClusterHostsTable";

import { useWindowTitle } from "app/base/hooks";
import type { KVMSetHeaderContent } from "app/kvm/types";
import type { RootState } from "app/store/root/types";
import vmClusterSelectors from "app/store/vmcluster/selectors";
import type { VMCluster } from "app/store/vmcluster/types";

type Props = {
  clusterId: VMCluster["id"];
  setHeaderContent: KVMSetHeaderContent;
};

const LXDClusterHosts = ({
  clusterId,
  setHeaderContent,
}: Props): JSX.Element => {
  const cluster = useSelector((state: RootState) =>
    vmClusterSelectors.getById(state, clusterId)
  );
  useWindowTitle(`${cluster?.name || "LXD cluster"} VM hosts`);

  return (
    <>
      {/* TODO: Add resources card */}
      {/* TODO: Add hosts toolbar */}
      <LXDClusterHostsTable
        clusterId={clusterId}
        setHeaderContent={setHeaderContent}
      />
    </>
  );
};

export default LXDClusterHosts;
