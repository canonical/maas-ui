import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
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
import type { SetSearchFilter } from "app/base/types";
import type { KVMHeaderContent } from "app/kvm/types";
import kvmURLs from "app/kvm/urls";
import { FilterMachines } from "app/store/machine/utils";
import { actions as podActions } from "app/store/pod";
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
  const hostId = params.hostId !== "" ? Number(params.hostId) : null;
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
          setSearchFilter={setSearchFilter}
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
