import { Link, useLocation } from "react-router-dom";

import KVMDetailsHeader from "app/kvm/components/KVMDetailsHeader";
import type { KVMHeaderContent, KVMSetHeaderContent } from "app/kvm/types";
import kvmURLs from "app/kvm/urls";
import type { VMCluster } from "app/store/vmcluster/types";

type Props = {
  headerContent: KVMHeaderContent | null;
  id: VMCluster["id"];
  setHeaderContent: KVMSetHeaderContent;
};

const LXDClusterDetailsHeader = ({
  headerContent,
  id,
  setHeaderContent,
}: Props): JSX.Element => {
  const location = useLocation();

  return (
    <KVMDetailsHeader
      headerContent={headerContent}
      tabLinks={[
        {
          active: location.pathname.endsWith(kvmURLs.lxd.cluster.hosts({ id })),
          component: Link,
          label: "KVM hosts",
          to: kvmURLs.lxd.cluster.hosts({ id }),
        },
        {
          active: location.pathname.endsWith(
            kvmURLs.lxd.cluster.vms.index({ id })
          ),
          component: Link,
          label: "Virtual machines",
          to: kvmURLs.lxd.cluster.vms.index({ id }),
        },
        {
          active: location.pathname.endsWith(
            kvmURLs.lxd.cluster.resources({ id })
          ),
          component: Link,
          label: "Resources",
          to: kvmURLs.lxd.cluster.resources({ id }),
        },
      ]}
      setHeaderContent={setHeaderContent}
      title="Cluster name"
      titleBlocks={[
        // TODO: Use actual cluster data
        {
          title: "Cluster:",
          subtitle: "15 members",
        },
        {
          title: "VMs:",
          subtitle: "12 available",
        },
        {
          title: "AZ:",
          subtitle: "euw-02",
        },
        {
          title: "LXD project:",
          subtitle: "default",
        },
      ]}
    />
  );
};

export default LXDClusterDetailsHeader;
