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

import MainContentSection from "app/base/components/MainContentSection";
import ModelNotFound from "app/base/components/ModelNotFound";
import { useGetURLId } from "app/base/hooks/urls";
import type { SetSearchFilter } from "app/base/types";
import urls from "app/base/urls";
import type { KVMHeaderContent } from "app/kvm/types";
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
  const gettingVmCluster = useSelector((state: RootState) =>
    vmClusterSelectors.status(state, "getting")
  );
  const vmCluster = useSelector((state: RootState) =>
    vmClusterSelectors.getById(state, clusterId)
  );
  const fetchedVmCluster = !gettingVmCluster && vmCluster;

  const loaded = clustersLoaded || fetchedVmCluster;
  const [sidePanelContent, setSidePanelContent] =
    useState<KVMHeaderContent | null>(null);

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
        linkURL={urls.kvm.lxd.index}
        modelName="LXD cluster"
      />
    );
  }

  const base = urls.kvm.lxd.cluster.index(null);
  return (
    <MainContentSection
      aria-label={Label.Title}
      header={
        <LXDClusterDetailsHeader
          clusterId={clusterId}
          setSearchFilter={setSearchFilter}
          setSidePanelContent={setSidePanelContent}
          sidePanelContent={sidePanelContent}
        />
      }
    >
      <Routes>
        <Route
          element={
            <LXDClusterHosts
              clusterId={clusterId}
              setSidePanelContent={setSidePanelContent}
            />
          }
          path={getRelativeRoute(urls.kvm.lxd.cluster.hosts(null), base)}
        />
        <Route
          element={
            <LXDClusterVMs
              clusterId={clusterId}
              searchFilter={searchFilter}
              setSearchFilter={setSearchFilter}
              setSidePanelContent={setSidePanelContent}
            />
          }
          path={getRelativeRoute(urls.kvm.lxd.cluster.vms.index(null), base)}
        />
        <Route
          element={<LXDClusterResources clusterId={clusterId} />}
          path={getRelativeRoute(urls.kvm.lxd.cluster.resources(null), base)}
        />
        <Route
          element={
            <LXDClusterSettings
              clusterId={clusterId}
              setSidePanelContent={setSidePanelContent}
            />
          }
          path={getRelativeRoute(urls.kvm.lxd.cluster.edit(null), base)}
        />
        <Route
          element={
            <LXDClusterHostVMs
              clusterId={clusterId}
              searchFilter={searchFilter}
              setSearchFilter={setSearchFilter}
              setSidePanelContent={setSidePanelContent}
            />
          }
          path={getRelativeRoute(urls.kvm.lxd.cluster.vms.host(null), base)}
        />
        <Route
          element={<LXDClusterHostSettings clusterId={clusterId} />}
          path={getRelativeRoute(urls.kvm.lxd.cluster.host.edit(null), base)}
        />
        <Route
          element={<Redirect to={urls.kvm.lxd.cluster.hosts({ clusterId })} />}
          path={getRelativeRoute(urls.kvm.lxd.cluster.index(null), base)}
        />
        <Route
          element={<LXDClusterDetailsRedirect clusterId={clusterId} />}
          path={getRelativeRoute(urls.kvm.lxd.cluster.host.index(null), base)}
        />
      </Routes>
    </MainContentSection>
  );
};

export default LXDClusterDetails;
