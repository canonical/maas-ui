import { useCallback, useEffect, useState } from "react";

import { Strip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom-v5-compat";

import LXDClusterSummaryCard from "../LXDClusterSummaryCard";

import LXDClusterHostsActionBar from "./LXDClusterHostsActionBar";
import LXDClusterHostsTable from "./LXDClusterHostsTable";

import { useWindowTitle } from "app/base/hooks";
import type { SetSearchFilter } from "app/base/types";
import type { KVMSetHeaderContent } from "app/kvm/types";
import { FilterMachines } from "app/store/machine/utils";
import podSelectors from "app/store/pod/selectors";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import vmClusterSelectors from "app/store/vmcluster/selectors";
import type { VMCluster } from "app/store/vmcluster/types";

type Props = {
  clusterId: VMCluster["id"];
  setHeaderContent: KVMSetHeaderContent;
};

const LXDClusterHosts = ({
  clusterId,
  setHeaderContent,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const cluster = useSelector((state: RootState) =>
    vmClusterSelectors.getById(state, clusterId)
  );
  const [currentPage, setCurrentPage] = useState(1);
  // Search filter is determined by the URL and used to initialise state.
  const currentFilters = FilterMachines.queryStringToFilters(location.search);
  const [searchFilter, setFilter] = useState<string>(
    FilterMachines.filtersToString(currentFilters)
  );
  const hosts = useSelector((state: RootState) =>
    podSelectors.searchInCluster(state, clusterId, searchFilter)
  );
  useWindowTitle(`${cluster?.name || "LXD cluster"} KVM hosts`);

  useEffect(() => {
    dispatch(tagActions.fetch());
  }, [dispatch]);

  const setSearchFilter: SetSearchFilter = useCallback(
    (searchFilter: string) => {
      setFilter(searchFilter);
      const filters = FilterMachines.getCurrentFilters(searchFilter);
      navigate({ search: FilterMachines.filtersToQueryString(filters) });
    },
    [setFilter, navigate]
  );

  return (
    <>
      <Strip shallow>
        <LXDClusterSummaryCard clusterId={clusterId} />
      </Strip>
      <LXDClusterHostsActionBar
        clusterId={clusterId}
        currentPage={currentPage}
        hosts={hosts}
        searchFilter={searchFilter}
        setCurrentPage={setCurrentPage}
        setSearchFilter={setSearchFilter}
      />
      <LXDClusterHostsTable
        clusterId={clusterId}
        currentPage={currentPage}
        hosts={hosts}
        searchFilter={searchFilter}
        setHeaderContent={setHeaderContent}
      />
    </>
  );
};

export default LXDClusterHosts;
