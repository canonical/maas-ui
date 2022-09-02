import type { ReactNode } from "react";

import type { ValueOf } from "@canonical/react-components";
import { MainTable, Spinner, Strip } from "@canonical/react-components";
import { useSelector } from "react-redux";

import CoresColumn from "./CoresColumn";
import HugepagesColumn from "./HugepagesColumn";
import IPColumn from "./IPColumn";
import NameColumn from "./NameColumn";
import StatusColumn from "./StatusColumn";

import DoubleRow from "app/base/components/DoubleRow";
import TableHeader from "app/base/components/TableHeader";
import { SortDirection } from "app/base/types";
import AllCheckbox from "app/machines/views/MachineList/MachineListTable/AllCheckbox";
import type { Machine } from "app/store/machine/types";
import { FetchGroupKey } from "app/store/machine/types";
import { FilterMachineItems } from "app/store/machine/utils";
import tagSelectors from "app/store/tag/selectors";
import type { Tag } from "app/store/tag/types";
import { getTagNamesForIds } from "app/store/tag/utils";
import { formatBytes } from "app/utils";

export type GetHostColumn = (vm: Machine) => ReactNode;

export type GetResources = (vm: Machine) => {
  hugepagesBacked: boolean;
  pinnedCores: number[];
  unpinnedCores: number;
};

type Props = {
  callId?: string | null;
  displayForCluster?: boolean;
  getHostColumn?: GetHostColumn;
  getResources: GetResources;
  machinesLoading: boolean;
  searchFilter: string;
  sortDirection: ValueOf<typeof SortDirection>;
  sortKey: FetchGroupKey | null;
  setSortDirection: (sortDirection: ValueOf<typeof SortDirection>) => void;
  setSortKey: (sortKey: FetchGroupKey | null) => void;
  vms: Machine[];
};

const generateRows = (
  vms: Machine[],
  getResources: GetResources,
  tags: Tag[],
  getHostColumn?: GetHostColumn,
  callId?: string | null
) =>
  vms.map((vm) => {
    const memory = formatBytes(vm.memory, "GiB", { binary: true });
    const storage = formatBytes(vm.storage, "GB");
    const resources = getResources(vm);
    const tagString = getTagNamesForIds(vm.tags, tags).join(", ");
    return {
      columns: [
        {
          className: "name-col",
          content: <NameColumn callId={callId} systemId={vm.system_id} />,
        },
        {
          className: "status-col",
          content: <StatusColumn systemId={vm.system_id} />,
        },
        ...(getHostColumn ? [{ content: getHostColumn(vm) }] : []),
        {
          className: "ipv4-col",
          content: <IPColumn systemId={vm.system_id} version={4} />,
        },
        {
          className: "ipv6-col",
          content: <IPColumn systemId={vm.system_id} version={6} />,
        },
        {
          className: "hugepages-col",
          content: (
            <HugepagesColumn hugepagesBacked={resources.hugepagesBacked} />
          ),
        },
        {
          className: "cores-col u-align--right",
          content: (
            <CoresColumn
              pinnedCores={resources.pinnedCores}
              unpinnedCores={resources.unpinnedCores}
            />
          ),
        },
        {
          className: "ram-col",
          content: (
            <DoubleRow
              primary={
                <>
                  <span>{memory.value} </span>
                  <small className="u-text--muted">{memory.unit}</small>
                </>
              }
              secondary={
                <>
                  <span>{storage.value} </span>
                  <small className="u-text--muted">{storage.unit}</small>
                </>
              }
            />
          ),
        },
        {
          className: "pool-col",
          content: (
            <DoubleRow
              data-testid="pool-col"
              primary={vm.pool.name}
              secondary={tagString}
              secondaryTitle={tagString}
            />
          ),
        },
      ],
      key: vm.system_id,
    };
  });

const VMsTable = ({
  callId,
  displayForCluster,
  getHostColumn,
  getResources,
  machinesLoading,
  searchFilter,
  setSortDirection,
  setSortKey,
  sortDirection,
  sortKey,
  vms,
}: Props): JSX.Element => {
  const tags = useSelector(tagSelectors.all);
  const currentSort = {
    direction: sortDirection,
    key: sortKey,
  };
  const updateSort = (newSortKey: Props["sortKey"]) => {
    if (newSortKey === sortKey) {
      if (sortDirection === SortDirection.ASCENDING) {
        setSortKey(null);
        setSortDirection(SortDirection.NONE);
      } else {
        setSortDirection(SortDirection.ASCENDING);
      }
    } else {
      setSortKey(newSortKey);
      setSortDirection(SortDirection.DESCENDING);
    }
  };

  if (machinesLoading) {
    return <Spinner text="Loading..." />;
  }
  return (
    <>
      <MainTable
        className="vms-table"
        emptyStateMsg={
          searchFilter && vms.length === 0 ? (
            <Strip rowClassName="u-align--center" shallow>
              <span data-testid="no-vms">
                No VMs in this {displayForCluster ? "cluster" : "KVM host"}{" "}
                match the search criteria.
              </span>
            </Strip>
          ) : null
        }
        headers={[
          {
            className: "name-col",
            content: (
              <div className="u-flex">
                <AllCheckbox
                  callId={callId}
                  filter={FilterMachineItems.parseFetchFilters(searchFilter)}
                />
                <div>
                  <TableHeader
                    currentSort={currentSort}
                    data-testid="name-header"
                    onClick={() => updateSort(FetchGroupKey.Hostname)}
                    sortKey={FetchGroupKey.Hostname}
                  >
                    VM name
                  </TableHeader>
                </div>
              </div>
            ),
          },
          {
            className: "status-col",
            content: (
              <TableHeader
                className="p-double-row__header-spacer"
                currentSort={currentSort}
                onClick={() => updateSort(FetchGroupKey.Status)}
                sortKey={FetchGroupKey.Status}
              >
                Status
              </TableHeader>
            ),
          },
          ...(getHostColumn
            ? [
                {
                  className: "host-col",
                  content: (
                    <TableHeader data-testid="host-column">
                      KVM host
                    </TableHeader>
                  ),
                },
              ]
            : []),
          {
            className: "ipv4-col",
            content: <TableHeader>IPv4</TableHeader>,
          },
          {
            className: "ipv6-col",
            content: <TableHeader>IPv6</TableHeader>,
          },
          {
            className: "hugepages-col",
            content: <TableHeader>Hugepages</TableHeader>,
          },
          {
            className: "cores-col u-align--right",
            content: <TableHeader>Cores</TableHeader>,
          },
          {
            className: "ram-col",
            content: (
              <>
                <TableHeader
                  currentSort={currentSort}
                  onClick={() => updateSort(FetchGroupKey.Memory)}
                  sortKey={FetchGroupKey.Memory}
                >
                  RAM
                </TableHeader>
                <TableHeader>Storage</TableHeader>
              </>
            ),
          },
          {
            className: "pool-col",
            content: (
              <>
                <TableHeader
                  currentSort={currentSort}
                  onClick={() => updateSort(FetchGroupKey.Pool)}
                  sortKey={FetchGroupKey.Pool}
                >
                  Pool
                </TableHeader>
                <TableHeader>Tag</TableHeader>
              </>
            ),
          },
        ]}
        rows={generateRows(vms, getResources, tags, getHostColumn, callId)}
      />
    </>
  );
};

export default VMsTable;
