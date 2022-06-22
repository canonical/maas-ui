import { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom-v5-compat";

import LXDClusterDetailsHeader from "./LXDClusterDetailsHeader";
import LXDClusterDetailsRedirect from "./LXDClusterDetailsRedirect";
import LXDClusterHostSettings from "./LXDClusterHostSettings";
import LXDClusterHostVMs from "./LXDClusterHostVMs";
import LXDClusterHosts from "./LXDClusterHosts";
import LXDClusterResources from "./LXDClusterResources";
import LXDClusterSettings from "./LXDClusterSettings";
import LXDClusterVMs from "./LXDClusterVMs";

import ModelNotFound from "app/base/components/ModelNotFound";
import Section from "app/base/components/Section";
import { useCycled } from "app/base/hooks";
import { useGetURLId } from "app/base/hooks/urls";
import type { SetSearchFilter } from "app/base/types";
import type { KVMHeaderContent } from "app/kvm/types";
import kvmURLs from "app/kvm/urls";
import { FilterMachines } from "app/store/machine/utils";
import { actions as podActions } from "app/store/pod";
import type { RootState } from "app/store/root/types";
import { actions as vmClusterActions } from "app/store/vmcluster";
import vmClusterSelectors from "app/store/vmcluster/selectors";
import { VMClusterMeta } from "app/store/vmcluster/types";
import { getRelativeRoute, isId } from "app/utils";

export enum Label {
  Title = "LXD cluster details",
}

const LXDClusterDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const clusterId = useGetURLId(VMClusterMeta.PK, "clusterId");
  const cluster = useSelector((state: RootState) =>
    vmClusterSelectors.getById(state, clusterId)
  );
  const clustersLoaded = useSelector(vmClusterSelectors.loaded);
  const getting = useSelector((state: RootState) =>
    vmClusterSelectors.status(state, "getting")
  );
  const [fetched] = useCycled(getting);
  const loaded = clustersLoaded || fetched;
  const [headerContent, setHeaderContent] = useState<KVMHeaderContent | null>(
    null
  );

  // Search filter is determined by the URL and used to initialise state.
  const currentFilters = FilterMachines.queryStringToFilters(location.search);
  const [searchFilter, setFilter] = useState<string>(
    FilterMachines.filtersToString(currentFilters)
  );

  const setSearchFilter: SetSearchFilter = useCallback(
    (searchFilter: string) => {
      setFilter(searchFilter);
      const filters = FilterMachines.getCurrentFilters(searchFilter);
      navigate({ search: FilterMachines.filtersToQueryString(filters) });
    },
    [setFilter, navigate]
  );

  useEffect(() => {
    dispatch(podActions.fetch());
    if (isId(clusterId)) {
      dispatch(vmClusterActions.get(clusterId));
    }
  }, [clusterId, dispatch]);

  if (!isId(clusterId) || (loaded && !cluster)) {
    return (
      <ModelNotFound
        id={clusterId}
        linkText="View all LXD hosts"
        linkURL={kvmURLs.lxd.index}
        modelName="LXD cluster"
      />
    );
  }

  const base = kvmURLs.lxd.cluster.index(null, true);
  return (
    <Section
      aria-label={Label.Title}
      header={
        <LXDClusterDetailsHeader
          clusterId={clusterId}
          headerContent={headerContent}
          setHeaderContent={setHeaderContent}
          setSearchFilter={setSearchFilter}
        />
      }
    >
      <Routes>
        <Route
          element={
            <LXDClusterHosts
              clusterId={clusterId}
              setHeaderContent={setHeaderContent}
            />
          }
          path={getRelativeRoute(kvmURLs.lxd.cluster.hosts(null, true), base)}
        />
        <Route
          element={
            <LXDClusterVMs
              clusterId={clusterId}
              searchFilter={searchFilter}
              setHeaderContent={setHeaderContent}
              setSearchFilter={setSearchFilter}
            />
          }
          path={getRelativeRoute(
            kvmURLs.lxd.cluster.vms.index(null, true),
            base
          )}
        />
        <Route
          element={<LXDClusterResources clusterId={clusterId} />}
          path={getRelativeRoute(
            kvmURLs.lxd.cluster.resources(null, true),
            base
          )}
        />
        <Route
          element={
            <LXDClusterSettings
              clusterId={clusterId}
              setHeaderContent={setHeaderContent}
            />
          }
          path={getRelativeRoute(kvmURLs.lxd.cluster.edit(null, true), base)}
        />
        <Route
          element={
            <LXDClusterHostVMs
              clusterId={clusterId}
              searchFilter={searchFilter}
              setHeaderContent={setHeaderContent}
              setSearchFilter={setSearchFilter}
            />
          }
          path={getRelativeRoute(
            kvmURLs.lxd.cluster.vms.host(null, true),
            base
          )}
        />
        <Route
          element={<LXDClusterHostSettings clusterId={clusterId} />}
          path={getRelativeRoute(
            kvmURLs.lxd.cluster.host.edit(null, true),
            base
          )}
        />
        <Route
          element={<Redirect to={kvmURLs.lxd.cluster.hosts({ clusterId })} />}
          path={getRelativeRoute(kvmURLs.lxd.cluster.index(null, true), base)}
        />
        <Route
          element={<LXDClusterDetailsRedirect clusterId={clusterId} />}
          path={getRelativeRoute(
            kvmURLs.lxd.cluster.host.index(null, true),
            base
          )}
        />
      </Routes>
    </Section>
  );
};

export default LXDClusterDetails;
