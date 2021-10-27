import { Button, Icon } from "@canonical/react-components";
import { useSelector } from "react-redux";

import type { SetSearchFilter } from "app/base/types";
import KVMActionBar from "app/kvm/components/KVMActionBar";
import { KVMHeaderViews } from "app/kvm/constants";
import type { KVMSetHeaderContent } from "app/kvm/types";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import vmClusterSelectors from "app/store/vmcluster/selectors";
import type { VMCluster, VMClusterMeta } from "app/store/vmcluster/types";

type Props = {
  clusterId: VMCluster[VMClusterMeta.PK];
  currentPage: number;
  searchFilter: string;
  setCurrentPage: (page: number) => void;
  setSearchFilter: SetSearchFilter;
  setHeaderContent: KVMSetHeaderContent;
  hosts: Pod[];
};

const LXDClusterHostsActionBar = ({
  clusterId,
  currentPage,
  searchFilter,
  setCurrentPage,
  setSearchFilter,
  setHeaderContent,
  hosts,
}: Props): JSX.Element | null => {
  const cluster = useSelector((state: RootState) =>
    vmClusterSelectors.getById(state, clusterId)
  );
  const fetching = useSelector(vmClusterSelectors.loading);
  const getting = useSelector((state: RootState) =>
    vmClusterSelectors.status(state, "getting")
  );
  const loading = fetching || getting;

  if (!cluster) {
    return null;
  }

  return (
    <KVMActionBar
      actions={
        <Button
          className="u-rotate-right"
          appearance="base"
          data-test="refresh-hosts"
          hasIcon
          onClick={() => {
            if (cluster.hosts.length) {
              setHeaderContent({
                view: KVMHeaderViews.REFRESH_KVM,
                extras: { hostIds: cluster.hosts.map((host) => host.id) },
              });
            }
          }}
          small
        >
          <Icon name="restart" />
        </Button>
      }
      currentPage={currentPage}
      itemCount={hosts.length}
      loading={loading}
      onSearchChange={setSearchFilter}
      searchFilter={searchFilter}
      setCurrentPage={setCurrentPage}
    />
  );
};

export default LXDClusterHostsActionBar;
