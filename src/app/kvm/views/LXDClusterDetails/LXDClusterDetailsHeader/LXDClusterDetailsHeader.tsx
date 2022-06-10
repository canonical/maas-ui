import type { ReactNode } from "react";
import { useEffect } from "react";

import { Icon, Spinner } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom-v5-compat";

import type { SetSearchFilter } from "app/base/types";
import KVMDetailsHeader from "app/kvm/components/KVMDetailsHeader";
import type { KVMHeaderContent, KVMSetHeaderContent } from "app/kvm/types";
import kvmURLs from "app/kvm/urls";
import { getFormTitle } from "app/kvm/utils";
import type { RootState } from "app/store/root/types";
import vmClusterSelectors from "app/store/vmcluster/selectors";
import type { VMCluster } from "app/store/vmcluster/types";
import { actions as zoneActions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";

type Props = {
  clusterId: VMCluster["id"];
  headerContent: KVMHeaderContent | null;
  setHeaderContent: KVMSetHeaderContent;
  setSearchFilter: SetSearchFilter;
};

const LXDClusterDetailsHeader = ({
  clusterId,
  headerContent,
  setHeaderContent,
  setSearchFilter,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const cluster = useSelector((state: RootState) =>
    vmClusterSelectors.getById(state, clusterId)
  );
  const zone = useSelector((state: RootState) =>
    zoneSelectors.getById(state, cluster?.availability_zone)
  );
  const location = useLocation();

  useEffect(() => {
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  let title: ReactNode = <Spinner text="Loading..." />;
  if (cluster) {
    if (headerContent) {
      title = getFormTitle(headerContent);
    } else {
      title = cluster.name;
    }
  }

  return (
    <KVMDetailsHeader
      className="has-icon"
      headerContent={headerContent}
      loading={!cluster}
      setHeaderContent={setHeaderContent}
      setSearchFilter={setSearchFilter}
      tabLinks={[
        {
          active: location.pathname.endsWith(
            kvmURLs.lxd.cluster.hosts({ clusterId })
          ),
          component: Link,
          label: "KVM hosts",
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
          label: "Cluster settings",
          to: kvmURLs.lxd.cluster.edit({ clusterId }),
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
                subtitle: zone?.name || <Spinner />,
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
