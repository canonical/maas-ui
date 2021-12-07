import { MainTable } from "@canonical/react-components";
import type { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";
import { useSelector } from "react-redux";

import BootStatus from "../BootStatus";
import NumaNodes from "../NumaNodes";
import TestStatus from "../TestStatus";

import DoubleRow from "app/base/components/DoubleRow";
import TagLinks from "app/base/components/TagLinks";
import machineURLs from "app/machines/urls";
import machineSelectors from "app/store/machine/selectors";
import type { Disk, Machine, Partition } from "app/store/machine/types";
import {
  diskAvailable,
  FilterMachines,
  formatType,
  formatSize,
  isMachineDetails,
  partitionAvailable,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

type Props = { systemId: Machine["system_id"] };

const normaliseColumns = (storageDevice: Disk | Partition) => {
  return [
    {
      content: (
        <DoubleRow
          primary={storageDevice.name}
          secondary={"serial" in storageDevice && storageDevice.serial}
        />
      ),
      "aria-label": "Name & serial",
    },
    {
      content: (
        <DoubleRow
          primary={"model" in storageDevice ? storageDevice.model : "—"}
          secondary={
            "firmware_version" in storageDevice &&
            storageDevice.firmware_version
          }
        />
      ),
      "aria-label": "Model & firmware",
    },
    {
      content: (
        <DoubleRow
          primary={
            "is_boot" in storageDevice ? (
              <BootStatus disk={storageDevice} />
            ) : (
              "—"
            )
          }
        />
      ),
      "aria-label": "Boot",
    },
    {
      content: <DoubleRow primary={formatSize(storageDevice.size)} />,
      "aria-label": "Size",
    },
    {
      content: (
        <DoubleRow
          data-testid="type"
          primary={formatType(storageDevice)}
          secondary={
            ("numa_node" in storageDevice || "numa_nodes" in storageDevice) && (
              <NumaNodes disk={storageDevice} />
            )
          }
        />
      ),
      "aria-label": "Type & NUMA node",
    },
    {
      content: (
        <DoubleRow
          data-testid="health"
          primary={
            "test_status" in storageDevice ? (
              <TestStatus testStatus={storageDevice.test_status} />
            ) : (
              "—"
            )
          }
          secondary={
            <TagLinks
              getLinkURL={(tag) => {
                const filter = FilterMachines.filtersToQueryString({
                  storage_tags: [`=${tag}`],
                });
                return `${machineURLs.machines.index}${filter}`;
              }}
              tags={storageDevice.tags}
            />
          }
        />
      ),
      "aria-label": "Health & Tags",
    },
    {
      "aria-label": "Used for",
      className: "u-break-spaces",
      content: storageDevice.used_for,
    },
  ];
};

const UsedStorageTable = ({ systemId }: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );

  if (isMachineDetails(machine)) {
    const rows: MainTableRow[] = [];

    machine.disks.forEach((disk) => {
      if (!diskAvailable(disk)) {
        const rowId = `${disk.type}-${disk.id}`;
        rows.push({
          columns: normaliseColumns(disk),
          key: rowId,
        });
      }

      if (disk.partitions) {
        disk.partitions.forEach((partition) => {
          if (!partitionAvailable(partition)) {
            const rowId = `${partition.type}-${partition.id}`;
            rows.push({
              columns: normaliseColumns(partition),
              key: rowId,
            });
          }
        });
      }
    });

    return (
      <>
        <MainTable
          className="p-table-expanding--light"
          responsive
          headers={[
            {
              content: (
                <>
                  <div>Name</div>
                  <div>Serial</div>
                </>
              ),
            },
            {
              content: (
                <>
                  <div>Model</div>
                  <div>Firmware</div>
                </>
              ),
            },
            {
              content: <div>Boot</div>,
            },
            { content: <div>Size</div> },
            {
              content: (
                <>
                  <div>Type</div>
                  <div>NUMA node</div>
                </>
              ),
            },
            {
              content: (
                <>
                  <div>Health</div>
                  <div>Tags</div>
                </>
              ),
            },
            {
              content: "Used for",
            },
          ]}
          rows={rows}
        />
        {rows.length === 0 && (
          <div className="u-nudge-right--small" data-testid="no-used">
            No disk or partition has been fully utilised.
          </div>
        )}
      </>
    );
  }
  return null;
};

export default UsedStorageTable;
