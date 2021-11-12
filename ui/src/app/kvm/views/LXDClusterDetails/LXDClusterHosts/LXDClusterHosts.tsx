import { useState } from "react";

import { Strip } from "@canonical/react-components";
import { useSelector } from "react-redux";

import LXDClusterSummaryCard from "../LXDClusterSummaryCard";

import LXDClusterHostsActionBar from "./LXDClusterHostsActionBar";
import LXDClusterHostsTable from "./LXDClusterHostsTable";

import { useWindowTitle } from "app/base/hooks";
import type { KVMSetHeaderContent } from "app/kvm/types";
import podSelectors from "app/store/pod/selectors";
import type { RootState } from "app/store/root/types";
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
  const cluster = useSelector((state: RootState) =>
    vmClusterSelectors.getById(state, clusterId)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const hosts = useSelector((state: RootState) =>
    podSelectors.searchInCluster(state, clusterId, searchFilter)
  );
  useWindowTitle(`${cluster?.name || "LXD cluster"} KVM hosts`);

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
        setHeaderContent={setHeaderContent}
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
