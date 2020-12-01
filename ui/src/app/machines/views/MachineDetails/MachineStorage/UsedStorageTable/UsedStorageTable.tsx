import { MainTable } from "@canonical/react-components";
import { useSelector } from "react-redux";

import BootStatus from "../BootStatus";
import NumaNodes from "../NumaNodes";
import TagLinks from "../TagLinks";
import TestStatus from "../TestStatus";
import {
  diskAvailable,
  formatType,
  formatSize,
  partitionAvailable,
} from "../utils-new";

import DoubleRow from "app/base/components/DoubleRow";
import type { TSFixMe } from "app/base/types";
import machineSelectors from "app/store/machine/selectors";
import type { Disk, Machine, Partition } from "app/store/machine/types";
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
          primaryClassName="u-align--center"
        />
      ),
    },
    {
      content: <DoubleRow primary={formatSize(storageDevice.size)} />,
    },
    {
      content: (
        <DoubleRow
          data-test="type"
          primary={formatType(storageDevice)}
          secondary={
            ("numa_node" in storageDevice || "numa_nodes" in storageDevice) && (
              <NumaNodes disk={storageDevice} />
            )
          }
        />
      ),
    },
    {
      content: (
        <DoubleRow
          data-test="health"
          primary={
            "test_status" in storageDevice ? (
              <TestStatus testStatus={storageDevice.test_status} />
            ) : (
              "—"
            )
          }
          secondary={<TagLinks tags={storageDevice.tags} />}
        />
      ),
    },
    { content: storageDevice.used_for },
  ];
};

const UsedStorageTable = ({ systemId }: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );

  if (machine && "disks" in machine) {
    const rows: TSFixMe[] = [];

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
              className: "u-align--center",
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
          <div className="u-nudge-right--small" data-test="no-used">
            No disk or partition has been fully utilised.
          </div>
        )}
      </>
    );
  }
  return null;
};

export default UsedStorageTable;
