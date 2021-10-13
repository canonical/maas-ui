import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch, useParams } from "react-router-dom";

import LXDClusterDetailsHeader from "./LXDClusterDetailsHeader";
import LXDClusterHosts from "./LXDClusterHosts";
import LXDClusterResources from "./LXDClusterResources";
import LXDClusterSettings from "./LXDClusterSettings";
import LXDClusterVMs from "./LXDClusterVMs";
import type { ClusterRouteParams } from "./types";

import Section from "app/base/components/Section";
import type { KVMHeaderContent } from "app/kvm/types";
import kvmURLs from "app/kvm/urls";
import { actions as podActions } from "app/store/pod";
import type { RootState } from "app/store/root/types";
import { actions as vmClusterActions } from "app/store/vmcluster";
import vmClusterSelectors from "app/store/vmcluster/selectors";

const LXDClusterDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const params = useParams<ClusterRouteParams>();
  const clusterId = Number(params.clusterId);
  const cluster = useSelector((state: RootState) =>
    vmClusterSelectors.getById(state, clusterId)
  );
  const clustersLoaded = useSelector(vmClusterSelectors.loaded);
  const [headerContent, setHeaderContent] = useState<KVMHeaderContent | null>(
    null
  );

  useEffect(() => {
    dispatch(podActions.fetch());
    // TODO: Update with "get" when api is fixed.
    // https://bugs.launchpad.net/maas/+bug/1946914
    dispatch(vmClusterActions.fetch());
  }, [dispatch]);

  // If cluster has been deleted, redirect to KVM list.
  if (clustersLoaded && !cluster) {
    return <Redirect to={kvmURLs.kvm} />;
  }

  return (
    <Section
      header={
        <LXDClusterDetailsHeader
          clusterId={clusterId}
          headerContent={headerContent}
          setHeaderContent={setHeaderContent}
        />
      }
      headerClassName="u-no-padding--bottom"
    >
      <Switch>
        <Route exact path={kvmURLs.lxd.cluster.hosts(null, true)}>
          <LXDClusterHosts clusterId={clusterId} />
        </Route>
        <Route exact path={kvmURLs.lxd.cluster.vms.index(null, true)}>
          <LXDClusterVMs clusterId={clusterId} />
        </Route>
        <Route exact path={kvmURLs.lxd.cluster.resources(null, true)}>
          <LXDClusterResources clusterId={clusterId} />
        </Route>
        <Route exact path={kvmURLs.lxd.cluster.edit(null, true)}>
          <LXDClusterSettings clusterId={clusterId} />
        </Route>
        <Redirect
          from={kvmURLs.lxd.cluster.index(null, true)}
          to={kvmURLs.lxd.cluster.hosts(null, true)}
        />
        <Redirect
          from={kvmURLs.lxd.cluster.host.index(null, true)}
          to={kvmURLs.lxd.cluster.host.edit(null, true)}
        />
      </Switch>
    </Section>
  );
};

export default LXDClusterDetails;
