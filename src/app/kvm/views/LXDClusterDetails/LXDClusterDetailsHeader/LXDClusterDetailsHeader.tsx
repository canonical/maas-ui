import type { ReactNode } from "react";

import { Button, Icon, Spinner } from "@canonical/react-components";
import pluralize from "pluralize";
import { useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";

import { useGetZone } from "@/app/api/query/zones";
import urls from "@/app/base/urls";
import KVMDetailsHeader from "@/app/kvm/components/KVMDetailsHeader";
import { KVMSidePanelViews } from "@/app/kvm/constants";
import type { KVMSetSidePanelContent } from "@/app/kvm/types";
import type { RootState } from "@/app/store/root/types";
import vmClusterSelectors from "@/app/store/vmcluster/selectors";
import type { VMCluster } from "@/app/store/vmcluster/types";

type Props = {
  clusterId: VMCluster["id"];
  setSidePanelContent: KVMSetSidePanelContent;
};

const LXDClusterDetailsHeader = ({
  clusterId,
  setSidePanelContent,
}: Props): JSX.Element => {
  const cluster = useSelector((state: RootState) =>
    vmClusterSelectors.getById(state, clusterId)
  );

  // clusterId will be of a known cluster, so we can safely assume that cluster will be defined
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const zone = useGetZone({ path: { zone_id: cluster?.availability_zone! } });
  const location = useLocation();
  const canRefresh = !!cluster?.hosts.length;

  let title: ReactNode = <Spinner text="Loading..." />;
  if (cluster) {
    title = cluster.name;
  }

  return (
    <KVMDetailsHeader
      buttons={[
        <Button
          appearance="positive"
          disabled={!canRefresh}
          hasIcon
          onClick={() => {
            if (canRefresh) {
              setSidePanelContent({
                view: KVMSidePanelViews.REFRESH_KVM,
                extras: { hostIds: cluster.hosts.map((host) => host.id) },
              });
            }
          }}
        >
          <Icon light name="restart" />
          <span>Refresh cluster</span>
        </Button>,
      ]}
      className="has-icon"
      loading={!cluster}
      setSidePanelContent={setSidePanelContent}
      tabLinks={[
        {
          active: location.pathname.endsWith(
            urls.kvm.lxd.cluster.hosts({ clusterId })
          ),
          component: Link,
          label: "KVM hosts",
          to: urls.kvm.lxd.cluster.hosts({ clusterId }),
        },
        {
          active: location.pathname.includes(
            urls.kvm.lxd.cluster.vms.index({ clusterId })
          ),
          component: Link,
          label: "Virtual machines",
          to: urls.kvm.lxd.cluster.vms.index({ clusterId }),
        },
        {
          active: location.pathname.endsWith(
            urls.kvm.lxd.cluster.resources({ clusterId })
          ),
          component: Link,
          label: "Resources",
          to: urls.kvm.lxd.cluster.resources({ clusterId }),
        },
        {
          active: location.pathname.endsWith(
            urls.kvm.lxd.cluster.edit({ clusterId })
          ),
          component: Link,
          label: "Cluster settings",
          to: urls.kvm.lxd.cluster.edit({ clusterId }),
        },
      ]}
      title={title}
      titleBlocks={
        cluster
          ? [
              {
                title: (
                  <>
                    <Icon name="cluster" />
                    <span className="u-nudge-right--small">Cluster:</span>
                  </>
                ),
                subtitle: (
                  <span className="u-nudge-right--large" data-testid="members">
                    {pluralize("member", cluster.hosts.length, true)}
                  </span>
                ),
              },
              {
                title: "VMs:",
                subtitle: `${cluster.virtual_machines.length} available`,
              },
              {
                title: "AZ:",
                subtitle: zone?.data?.name || <Spinner />,
              },
              {
                title: "LXD project:",
                subtitle: cluster.project,
              },
            ]
          : []
      }
    />
  );
};

export default LXDClusterDetailsHeader;
