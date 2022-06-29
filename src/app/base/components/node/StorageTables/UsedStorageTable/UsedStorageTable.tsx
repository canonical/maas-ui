import { MainTable } from "@canonical/react-components";
import type { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";

import DoubleRow from "app/base/components/DoubleRow";
import TagLinks from "app/base/components/TagLinks";
import DiskBootStatus from "app/base/components/node/DiskBootStatus";
import DiskNumaNodes from "app/base/components/node/DiskNumaNodes";
import DiskTestStatus from "app/base/components/node/DiskTestStatus";
import urls from "app/base/urls";
import type { ControllerDetails } from "app/store/controller/types";
import { FilterControllers } from "app/store/controller/utils";
import type { MachineDetails } from "app/store/machine/types";
import { FilterMachines } from "app/store/machine/utils";
import type { Disk, Partition } from "app/store/types/node";
import {
  diskAvailable,
  formatType,
  formatSize,
  partitionAvailable,
  nodeIsMachine,
} from "app/store/utils";

type Props = {
  node: ControllerDetails | MachineDetails;
};

const normaliseColumns = (
  storageDevice: Disk | Partition,
  node: Props["node"]
) => {
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
              <DiskBootStatus disk={storageDevice} />
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
              <DiskNumaNodes disk={storageDevice} />
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
              <DiskTestStatus testStatus={storageDevice.test_status} />
            ) : (
              "—"
            )
          }
          secondary={
            <TagLinks
              getLinkURL={(tag) => {
                if (nodeIsMachine(node)) {
                  const filter = FilterMachines.filtersToQueryString({
                    storage_tags: [`=${tag}`],
                  });
                  return `${urls.machines.index}${filter}`;
                }
                const filter = FilterControllers.filtersToQueryString({
                  storage_tags: [`=${tag}`],
                });
                return `${urls.controllers.index}${filter}`;
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

const UsedStorageTable = ({ node }: Props): JSX.Element | null => {
  const rows: MainTableRow[] = [];

  node.disks.forEach((disk) => {
    if (!diskAvailable(disk)) {
      const rowId = `${disk.type}-${disk.id}`;
      rows.push({
        columns: normaliseColumns(disk, node),
        key: rowId,
      });
    }

    if (disk.partitions) {
      disk.partitions.forEach((partition) => {
        if (!partitionAvailable(partition)) {
          const rowId = `${partition.type}-${partition.id}`;
          rows.push({
            columns: normaliseColumns(partition, node),
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
        responsive
        rows={rows}
      />
      {rows.length === 0 && (
        <div className="u-nudge-right--small" data-testid="no-used">
          No disk or partition has been fully utilised.
        </div>
      )}
    </>
  );
};

export default UsedStorageTable;
