import { MainTable, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import NameColumn from "./NameColumn";
import StatusColumn from "./StatusColumn";

import DoubleRow from "app/base/components/DoubleRow";
import GroupCheckbox from "app/base/components/GroupCheckbox";
import TableHeader from "app/base/components/TableHeader";
import { useTableSort } from "app/base/hooks";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import { formatBytes } from "app/utils";

type Props = {
  id: Pod["id"];
};

type SortKey = keyof Machine;

const getSortValue = (sortKey: SortKey, vm: Machine) => {
  switch (sortKey) {
    case "pool":
      return vm.pool?.name;
    default:
      return vm[sortKey];
  }
};

const generateRows = (vms: Machine[]) =>
  vms.map((vm) => {
    const memory = formatBytes(vm.memory, "GiB", { binary: true });
    const storage = formatBytes(vm.storage, "GB");

    return {
      columns: [
        {
          className: "name-col",
          content: <NameColumn systemId={vm.system_id} />,
        },
        {
          className: "status-col",
          content: <StatusColumn systemId={vm.system_id} />,
        },
        {
          className: "ipv4-col",
          content: "",
        },
        {
          className: "ipv6-col",
          content: "",
        },
        {
          className: "hugepages-col",
          content: "",
        },
        {
          className: "cores-col u-align--right",
          content: "",
        },
        {
          className: "ram-col u-align--right",
          content: (
            <>
              <span>{memory.value} </span>
              <small className="u-text--muted">{memory.unit}</small>
            </>
          ),
        },
        {
          className: "storage-col u-align--right",
          content: (
            <>
              <span>{storage.value} </span>
              <small className="u-text--muted">{storage.unit}</small>
            </>
          ),
        },
        {
          className: "pool-col",
          content: (
            <DoubleRow primary={vm.pool.name} secondary={vm.zone.name} />
          ),
        },
      ],
      key: vm.system_id,
    };
  });

const VMsTable = ({ id }: Props): JSX.Element => {
  const loading = useSelector(machineSelectors.loading);
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const vms = useSelector((state: RootState) =>
    podSelectors.getVMs(state, pod)
  );
  const { currentSort, sortRows, updateSort } = useTableSort<Machine, SortKey>(
    getSortValue,
    {
      key: "hostname",
      direction: "descending",
    }
  );
  const sortedVms = sortRows(vms);

  if (!pod || loading) {
    return <Spinner text="Loading..." />;
  }
  return (
    <MainTable
      className="vms-table"
      headers={[
        {
          className: "name-col",
          content: (
            <div className="u-flex">
              <GroupCheckbox
                items={vms.map((vm) => vm.system_id)}
                selectedItems={[]}
                handleGroupCheckbox={() => null}
              />
              <div>
                <TableHeader
                  currentSort={currentSort}
                  data-test="name-header"
                  onClick={() => updateSort("hostname")}
                  sortKey="hostname"
                >
                  Name
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
              onClick={() => updateSort("status")}
              sortKey="status"
            >
              Status
            </TableHeader>
          ),
        },
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
          className: "ram-col u-align--right",
          content: (
            <TableHeader
              currentSort={currentSort}
              onClick={() => updateSort("memory")}
              sortKey="memory"
            >
              RAM
            </TableHeader>
          ),
        },
        {
          className: "storage-col u-align--right",
          content: (
            <TableHeader
              currentSort={currentSort}
              onClick={() => updateSort("storage")}
              sortKey="storage"
            >
              Storage
            </TableHeader>
          ),
        },
        {
          className: "pool-col",
          content: (
            <>
              <TableHeader
                currentSort={currentSort}
                onClick={() => updateSort("pool")}
                sortKey="pool"
              >
                Resource pool
              </TableHeader>
              <TableHeader>AZ</TableHeader>
            </>
          ),
        },
      ]}
      rows={generateRows(sortedVms)}
    />
  );
};

export default VMsTable;
