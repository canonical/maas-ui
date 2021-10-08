import { useState } from "react";

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

const LXDClusterDetails = (): JSX.Element => {
  const params = useParams<ClusterRouteParams>();
  const clusterId = Number(params.clusterId);
  const [headerContent, setHeaderContent] = useState<KVMHeaderContent | null>(
    null
  );

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
