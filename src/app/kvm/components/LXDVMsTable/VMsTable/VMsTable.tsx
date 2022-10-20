import type { ReactNode } from "react";

import type { ValueOf } from "@canonical/react-components";
import { MainTable, Strip } from "@canonical/react-components";
import { useSelector } from "react-redux";

import CoresColumn from "./CoresColumn";
import HugepagesColumn from "./HugepagesColumn";
import IPColumn from "./IPColumn";
import NameColumn from "./NameColumn";
import StatusColumn from "./StatusColumn";

import DoubleRow from "app/base/components/DoubleRow";
import Placeholder from "app/base/components/Placeholder";
import TableHeader from "app/base/components/TableHeader";
import { SortDirection } from "app/base/types";
import AllCheckbox from "app/machines/views/MachineList/MachineListTable/AllCheckbox";
import type { Machine } from "app/store/machine/types";
import { FilterGroupKey, FetchGroupKey } from "app/store/machine/types";
import { FilterMachineItems } from "app/store/machine/utils";
import type { Pod } from "app/store/pod/types";
import tagSelectors from "app/store/tag/selectors";
import type { Tag } from "app/store/tag/types";
import { getTagNamesForIds } from "app/store/tag/utils";
import { formatBytes } from "app/utils";

export enum Label {
  Name = "Name",
  Status = "Status",
  Ipv4 = "Ipv4",
  Ipv6 = "Ipv6",
  Hugepages = "Hugepages",
  Cores = "Cores",
  Ram = "Ram",
  Pool = "Pool",
}

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
  pods: Pod["name"][];
  searchFilter: string;
  sortDirection: ValueOf<typeof SortDirection>;
  sortKey: FetchGroupKey | null;
  setSortDirection: (sortDirection: ValueOf<typeof SortDirection>) => void;
  setSortKey: (sortKey: FetchGroupKey | null) => void;
  vms: Machine[];
};

type RowContent = {
  Name: ReactNode;
  Status: ReactNode;
  Host?: ReactNode;
  Ipv4: ReactNode;
  Ipv6: ReactNode;
  Hugepages: ReactNode;
  Cores: ReactNode;
  Ram: ReactNode;
  Pool: ReactNode;
};

const generateRow = (content: RowContent, key: number | string) => ({
  columns: [
    {
      "aria-label": Label.Name,
      className: "name-col",
      content: content.Name,
    },
    {
      "aria-label": Label.Status,
      className: "status-col",
      content: content.Status,
    },
    ...(content.Host ? [{ content: content.Host }] : []),
    {
      "aria-label": Label.Ipv4,
      className: "ipv4-col",
      content: content.Ipv4,
    },
    {
      "aria-label": Label.Ipv6,
      className: "ipv6-col",
      content: content.Ipv6,
    },
    {
      "aria-label": Label.Hugepages,
      className: "hugepages-col",
      content: content.Hugepages,
    },
    {
      "aria-label": Label.Cores,
      className: "cores-col u-align--right",
      content: content.Cores,
    },
    {
      "aria-label": Label.Ram,
      className: "ram-col",
      content: content.Ram,
    },
    {
      "aria-label": Label.Pool,
      className: "pool-col",
      content: content.Pool,
    },
  ],
  key,
});

const generateSkeletonRows = (showHostsColumn: boolean) =>
  Array.from(Array(5)).map((_, i) =>
    generateRow(
      {
        Name: <DoubleRow primary={<Placeholder>xxxxxxxxx.xxxx</Placeholder>} />,
        Status: <DoubleRow primary={<Placeholder>XXXXX XXXXX</Placeholder>} />,
        Host: showHostsColumn ? (
          <DoubleRow primary={<Placeholder>xxxxxxxxx</Placeholder>} />
        ) : null,
        Ipv4: <DoubleRow primary={<Placeholder>xxx.xxx.xx.x</Placeholder>} />,
        Ipv6: (
          <DoubleRow
            primary={<Placeholder>xxxx:xxx::xxxx:xx:xxxx</Placeholder>}
          />
        ),
        Hugepages: <DoubleRow primary={<Placeholder>Xxxxxxx</Placeholder>} />,
        Cores: <DoubleRow primary={<Placeholder>XXX</Placeholder>} />,
        Ram: (
          <DoubleRow
            primary={<Placeholder>XXXxxx</Placeholder>}
            secondary={<Placeholder>Xxxx</Placeholder>}
          />
        ),
        Pool: (
          <DoubleRow
            primary={<Placeholder>Xxxx</Placeholder>}
            secondary={<Placeholder>Xxx, Xxxxxxx, Xxxxx</Placeholder>}
          />
        ),
      },
      i
    )
  );

const generateRows = ({
  vms,
  getResources,
  tags,
  getHostColumn,
  callId,
}: {
  vms: Machine[];
  getResources: GetResources;
  tags: Tag[];
  getHostColumn?: GetHostColumn;
  callId?: string | null;
}) =>
  vms.map((vm) => {
    const memory = formatBytes(vm.memory, "GiB", { binary: true });
    const storage = formatBytes(vm.storage, "GB");
    const resources = getResources(vm);
    const tagString = getTagNamesForIds(vm.tags, tags).join(", ");
    return generateRow(
      {
        Name: (
          <NameColumn
            aria-label={Label.Name}
            callId={callId}
            systemId={vm.system_id}
          />
        ),
        Status: (
          <StatusColumn aria-label={Label.Status} systemId={vm.system_id} />
        ),
        Host: getHostColumn?.(vm),
        Ipv4: (
          <IPColumn
            aria-label={Label.Ipv4}
            systemId={vm.system_id}
            version={4}
          />
        ),
        Ipv6: (
          <IPColumn
            aria-label={Label.Ipv6}
            systemId={vm.system_id}
            version={6}
          />
        ),
        Hugepages: (
          <HugepagesColumn
            aria-label={Label.Hugepages}
            hugepagesBacked={resources.hugepagesBacked}
          />
        ),
        Cores: (
          <CoresColumn
            aria-label={Label.Cores}
            pinnedCores={resources.pinnedCores}
            unpinnedCores={resources.unpinnedCores}
          />
        ),
        Ram: (
          <DoubleRow
            aria-label={Label.Ram}
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
        Pool: (
          <DoubleRow
            aria-label={Label.Pool}
            data-testid="pool-col"
            primary={vm.pool.name}
            secondary={tagString}
            secondaryTitle={tagString}
          />
        ),
      },
      vm.system_id
    );
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
  pods,
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
                  filter={{
                    ...FilterMachineItems.parseFetchFilters(searchFilter),
                    // Set the filters to get results that belong to this single pod or pods in a cluster.
                    [FilterGroupKey.Pod]: pods,
                  }}
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
        rows={
          machinesLoading
            ? generateSkeletonRows(!!getHostColumn)
            : generateRows({ vms, getResources, tags, getHostColumn, callId })
        }
      />
    </>
  );
};

export default VMsTable;
