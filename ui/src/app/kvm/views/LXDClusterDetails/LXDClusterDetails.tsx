import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom";

import LXDClusterDetailsHeader from "./LXDClusterDetailsHeader";
import LXDClusterHostSettings from "./LXDClusterHostSettings";
import LXDClusterHostVMs from "./LXDClusterHostVMs";
import LXDClusterHosts from "./LXDClusterHosts";
import LXDClusterResources from "./LXDClusterResources";
import LXDClusterSettings from "./LXDClusterSettings";
import LXDClusterVMs from "./LXDClusterVMs";
import type { ClusterRouteParams } from "./types";

import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";
import { useCycled } from "app/base/hooks";
import type { SetSearchFilter } from "app/base/types";
import type { KVMHeaderContent } from "app/kvm/types";
import kvmURLs from "app/kvm/urls";
import { FilterMachines } from "app/store/machine/utils";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import type { RootState } from "app/store/root/types";
import { actions as vmClusterActions } from "app/store/vmcluster";
import vmClusterSelectors from "app/store/vmcluster/selectors";

const LXDClusterDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const params = useParams<ClusterRouteParams>();
  const clusterId = Number(params.clusterId);
  const cluster = useSelector((state: RootState) =>
    vmClusterSelectors.getById(state, clusterId)
  );
  const clustersLoaded = useSelector(vmClusterSelectors.loaded);
  const getting = useSelector((state: RootState) =>
    vmClusterSelectors.status(state, "getting")
  );
  const [fetched] = useCycled(getting);
  const loaded = clustersLoaded || fetched;
  const hostId = params.hostId ? Number(params.hostId) : null;
  const host = useSelector((state: RootState) =>
    podSelectors.getById(state, hostId)
  );
  const hostsLoaded = useSelector(podSelectors.loaded);
  const [headerContent, setHeaderContent] = useState<KVMHeaderContent | null>(
    null
  );

  // Search filter is determined by the URL and used to initialise state.
  const currentFilters = FilterMachines.queryStringToFilters(location.search);
  const [searchFilter, setFilter] = useState<string>(
    FilterMachines.filtersToString(currentFilters)
  );

  const setSearchFilter: SetSearchFilter = (searchFilter: string) => {
    setFilter(searchFilter);
    const filters = FilterMachines.getCurrentFilters(searchFilter);
    history.push({ search: FilterMachines.filtersToQueryString(filters) });
  };

  useEffect(() => {
    dispatch(podActions.fetch());
    dispatch(vmClusterActions.get(clusterId));
  }, [clusterId, dispatch]);

  if (loaded && !cluster) {
    return (
      <Section
        header={<SectionHeader title="Cluster not found" />}
        data-testid="not-found"
      >
        <p>
          Unable to find a cluster with id "{clusterId}".{" "}
          <Link to={kvmURLs.kvm}>View all KVMs</Link>.
        </p>
      </Section>
    );
  }
  if (hostId !== null && hostsLoaded && !host) {
    return (
      <Section
        header={<SectionHeader title="KVM host not found" />}
        data-testid="host-not-found"
      >
        <p>
          Unable to find a KVM host with id "{hostId}".{" "}
          <Link to={kvmURLs.lxd.cluster.hosts({ clusterId })}>
            View all KVM hosts
          </Link>
          .
        </p>
      </Section>
    );
  }

  return (
    <Section
      header={
        <LXDClusterDetailsHeader
          clusterId={clusterId}
          headerContent={headerContent}
          setHeaderContent={setHeaderContent}
          setSearchFilter={setSearchFilter}
        />
      }
    >
      <Switch>
        <Route exact path={kvmURLs.lxd.cluster.hosts(null, true)}>
          <LXDClusterHosts
            clusterId={clusterId}
            setHeaderContent={setHeaderContent}
          />
        </Route>
        <Route exact path={kvmURLs.lxd.cluster.vms.index(null, true)}>
          <LXDClusterVMs
            clusterId={clusterId}
            searchFilter={searchFilter}
            setHeaderContent={setHeaderContent}
            setSearchFilter={setSearchFilter}
          />
        </Route>
        <Route exact path={kvmURLs.lxd.cluster.resources(null, true)}>
          <LXDClusterResources clusterId={clusterId} />
        </Route>
        <Route exact path={kvmURLs.lxd.cluster.edit(null, true)}>
          <LXDClusterSettings
            clusterId={clusterId}
            setHeaderContent={setHeaderContent}
          />
        </Route>
        <Route exact path={kvmURLs.lxd.cluster.vms.host(null, true)}>
          {hostId !== null && (
            <LXDClusterHostVMs
              clusterId={clusterId}
              hostId={hostId}
              searchFilter={searchFilter}
              setHeaderContent={setHeaderContent}
              setSearchFilter={setSearchFilter}
            />
          )}
        </Route>
        <Route exact path={kvmURLs.lxd.cluster.host.edit(null, true)}>
          {hostId !== null && (
            <LXDClusterHostSettings clusterId={clusterId} hostId={hostId} />
          )}
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
