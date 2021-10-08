import { Link, useLocation } from "react-router-dom";

import KVMDetailsHeader from "app/kvm/components/KVMDetailsHeader";
import type { KVMHeaderContent, KVMSetHeaderContent } from "app/kvm/types";
import kvmURLs from "app/kvm/urls";
import type { VMCluster } from "app/store/vmcluster/types";

type Props = {
  clusterId: VMCluster["id"];
  headerContent: KVMHeaderContent | null;
  setHeaderContent: KVMSetHeaderContent;
};

const LXDClusterDetailsHeader = ({
  clusterId,
  headerContent,
  setHeaderContent,
}: Props): JSX.Element => {
  const location = useLocation();

  return (
    <KVMDetailsHeader
      headerContent={headerContent}
      tabLinks={[
        {
          active: location.pathname.endsWith(
            kvmURLs.lxd.cluster.hosts({ clusterId })
          ),
          component: Link,
          label: "VM hosts",
          to: kvmURLs.lxd.cluster.hosts({ clusterId }),
        },
        {
          active: location.pathname.includes(
            kvmURLs.lxd.cluster.vms.index({ clusterId })
          ),
          component: Link,
          label: "Virtual machines",
          to: kvmURLs.lxd.cluster.vms.index({ clusterId }),
        },
        {
          active: location.pathname.endsWith(
            kvmURLs.lxd.cluster.resources({ clusterId })
          ),
          component: Link,
          label: "Resources",
          to: kvmURLs.lxd.cluster.resources({ clusterId }),
        },
        {
          active: location.pathname.endsWith(
            kvmURLs.lxd.cluster.edit({ clusterId })
          ),
          component: Link,
          label: "Settings",
          to: kvmURLs.lxd.cluster.edit({ clusterId }),
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
