import { useState } from "react";

import { MainTable } from "@canonical/react-components";
import { useSelector } from "react-redux";

import BootStatus from "../BootStatus";
import NumaNodes from "../NumaNodes";
import TagLinks from "../TagLinks";
import TestStatus from "../TestStatus";
import {
  canBePartitioned,
  diskAvailable,
  formatType,
  formatSize,
  isDatastore,
  partitionAvailable,
} from "../utils-new";

import AddPartition from "./AddPartition";

import DoubleRow from "app/base/components/DoubleRow";
import TableMenu from "app/base/components/TableMenu";
import type { TSFixMe } from "app/base/types";
import machineSelectors from "app/store/machine/selectors";
import type { Disk, Machine, Partition } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type Expanded = {
  content: "addPartition";
  id: string;
} | null;

type Props = {
  canEditStorage: boolean;
  systemId: Machine["system_id"];
};

const getDiskActions = (
  disk: Disk,
  rowId: string,
  setExpanded: (expanded: Expanded) => void
): TSFixMe[] => {
  const actions = [];
  if (canBePartitioned(disk)) {
    actions.push({
      children: "Add partition...",
      onClick: () => setExpanded({ content: "addPartition", id: rowId }),
    });
  }
  return actions;
};

const normaliseColumns = (
  storageDevice: Disk | Partition,
  canEditStorage: boolean,
  actions: TSFixMe[] = []
) => {
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
      className: "u-align--center",
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
    },
    {
      content: <DoubleRow primary={formatSize(storageDevice.size)} />,
    },
    {
      content: (
        <DoubleRow
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
    {
      className: "u-align--right",
      content: (
        <TableMenu
          disabled={!canEditStorage || actions.length === 0}
          links={actions}
          position="right"
          title="Take action:"
        />
      ),
    },
  ];
};

const AvailableStorageTable = ({
  canEditStorage,
  systemId,
}: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const [expanded, setExpanded] = useState<Expanded>(null);

  if (machine && "disks" in machine && "supported_filesystems" in machine) {
    const rows: TSFixMe[] = [];

    machine.disks.forEach((disk) => {
      if (diskAvailable(disk) && !isDatastore(disk.filesystem)) {
        const rowId = `${disk.type}-${disk.id}`;
        const diskActions = getDiskActions(disk, rowId, setExpanded);
        const isExpanded = expanded?.id === rowId && Boolean(expanded?.content);
        rows.push({
          className: isExpanded ? "p-table__row is-active" : null,
          columns: normaliseColumns(disk, canEditStorage, diskActions),
          expanded: isExpanded,
          expandedContent: isExpanded ? (
            <div className="u-flex--grow">
              {expanded?.content === "addPartition" && (
                <AddPartition
                  closeExpanded={() => setExpanded(null)}
                  disk={disk}
                  systemId={machine.system_id}
                />
              )}
            </div>
          ) : null,
          key: rowId,
        });
      }

      if (disk.partitions) {
        disk.partitions.forEach((partition) => {
          if (
            partitionAvailable(partition) &&
            !isDatastore(partition.filesystem)
          ) {
            const rowId = `${partition.type}-${partition.id}`;
            rows.push({
              columns: normaliseColumns(partition, canEditStorage),
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
          expanding
          headers={[
            {
              content: (
                <div>
                  <div>Name</div>
                  <div>Serial</div>
                </div>
              ),
            },
            {
              content: (
                <div>
                  <div>Model</div>
                  <div>Firmware</div>
                </div>
              ),
            },
            {
              className: "u-align--center",
              content: <div>Boot</div>,
            },
            {
              content: <div>Size</div>,
            },
            {
              content: (
                <div>
                  <div>Type</div>
                  <div>NUMA node</div>
                </div>
              ),
            },
            {
              content: (
                <div>
                  <div>Health</div>
                  <div>Tags</div>
                </div>
              ),
            },
            {
              className: "u-align--right",
              content: <div>Actions</div>,
            },
          ]}
          rows={rows}
        />
        {rows.length === 0 && (
          <div className="u-nudge-right--small" data-test="no-available">
            No available disks or partitions.
          </div>
        )}
      </>
    );
  }
  return null;
};

export default AvailableStorageTable;
