import { MainTable, Tooltip } from "@canonical/react-components";
import React from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import DoubleRow from "app/base/components/DoubleRow";
import TableHeader from "app/base/components/TableHeader";
import { scriptStatus } from "app/base/enum";
import { useTableSort } from "app/base/hooks";
import { filtersToQueryString } from "app/machines/search";
import type { Disk } from "app/store/machine/types";
import { formatBytes } from "app/utils";
import { storageDeviceInUse } from "../MachineStorage";

type StorageDevice = {
  boot: boolean | null;
  firmware: string | null;
  id: number;
  model: string | null;
  name: string;
  numaNodes: number[];
  parentType: string | null;
  serial: string | null;
  size: number;
  tags: string[];
  testStatus: number | null;
  type: string;
};

const formatTestStatus = (testStatus: StorageDevice["testStatus"]) => {
  switch (testStatus) {
    case scriptStatus.PENDING:
      return <i className="p-icon--pending"></i>;
    case scriptStatus.RUNNING:
    case scriptStatus.APPLYING_NETCONF:
    case scriptStatus.INSTALLING:
      return <i className="p-icon--running"></i>;
    case scriptStatus.PASSED:
      return (
        <>
          <i className="p-icon--success is-inline"></i>
          <span>OK</span>
        </>
      );
    case scriptStatus.FAILED:
    case scriptStatus.ABORTED:
    case scriptStatus.DEGRADED:
    case scriptStatus.FAILED_APPLYING_NETCONF:
    case scriptStatus.FAILED_INSTALLING:
      return (
        <>
          <i className="p-icon--error is-inline"></i>
          <span>Error</span>
        </>
      );
    case scriptStatus.TIMEDOUT:
      return (
        <>
          <i className="p-icon--timed-out is-inline"></i>
          <span>Timed out</span>
        </>
      );
    case scriptStatus.SKIPPED:
      return (
        <>
          <i className="p-icon--warning is-inline"></i>
          <span>Skipped</span>
        </>
      );
    default:
      return (
        <>
          <i className="p-icon--power-unknown is-inline"></i>
          <span>Unknown</span>
        </>
      );
  }
};

const formatTags = (tags: StorageDevice["tags"]) =>
  tags.map((tag, i) => {
    const filter = filtersToQueryString({ storage_tags: `=${tag}` });
    return (
      <span key={tag}>
        <Link to={`/machines${filter}`}>{tag}</Link>
        {i !== tags.length - 1 && ", "}
      </span>
    );
  });

const formatType = (
  type: StorageDevice["type"],
  parentType?: StorageDevice["parentType"]
) => {
  let typeToFormat = type;
  if (type === "virtual" && !!parentType) {
    if (parentType === "lvm-vg") {
      return "Logical volume";
    } else if (parentType.includes("raid-")) {
      return `RAID ${parentType.split("-")[1]}`;
    }
    typeToFormat = parentType;
  }

  switch (typeToFormat) {
    case "iscsi":
      return "ISCSI";
    case "lvm-vg":
      return "Volume group";
    case "partition":
      return "Partition";
    case "physical":
      return "Physical";
    case "virtual":
      return "Virtual";
    default:
      return type;
  }
};

const getAvailableStorageDevices = (disks: Disk[]): StorageDevice[] =>
  disks.reduce((available: StorageDevice[], disk: Disk) => {
    if (!storageDeviceInUse(disk)) {
      let numaNodes: StorageDevice["numaNodes"] = [];
      if (disk.numa_nodes) {
        numaNodes = disk.numa_nodes;
      } else if (disk.numa_node) {
        numaNodes = [disk.numa_node];
      }

      available.push({
        boot: disk.is_boot,
        firmware: disk.firmware_version,
        id: disk.id,
        model: disk.model,
        name: disk.name,
        numaNodes,
        parentType: disk.parent?.type || null,
        serial: disk.serial,
        size: disk.size,
        tags: disk.tags,
        testStatus: disk.test_status,
        type: disk.type,
      });
    }

    if (disk.partitions) {
      disk.partitions.forEach((partition) => {
        if (!storageDeviceInUse(partition)) {
          available.push({
            boot: null,
            firmware: null,
            id: partition.id,
            model: null,
            name: partition.name,
            numaNodes: [],
            parentType: null,
            serial: null,
            size: partition.size,
            tags: partition.tags,
            testStatus: null,
            type: partition.type,
          });
        }
      });
    }

    return available;
  }, []);

const getSortValue = (
  sortKey: keyof StorageDevice,
  storageDevice: StorageDevice
) => storageDevice[sortKey];

type Props = { disks: Disk[] };

const AvailableDisksTable = ({ disks }: Props): JSX.Element => {
  const { currentSort, sortRows, updateSort } = useTableSort(getSortValue, {
    key: "name",
    direction: "descending",
  });
  const availableStorageDevices = getAvailableStorageDevices(disks);
  // TODO: update useTableSort to TS with generics
  // https://github.com/canonical-web-and-design/maas-ui/issues/1869
  const sortedStorageDevices = sortRows(
    availableStorageDevices
  ) as StorageDevice[];

  return (
    <>
      <MainTable
        defaultSort="name"
        defaultSortDirection="ascending"
        headers={[
          {
            content: (
              <>
                <TableHeader
                  currentSort={currentSort}
                  onClick={() => updateSort("name")}
                  sortKey="name"
                >
                  Name
                </TableHeader>
                <TableHeader>Serial</TableHeader>
              </>
            ),
          },
          {
            content: (
              <>
                <TableHeader
                  currentSort={currentSort}
                  onClick={() => updateSort("model")}
                  sortKey="model"
                >
                  Model
                </TableHeader>
                <TableHeader>Firmware</TableHeader>
              </>
            ),
          },
          {
            className: "u-align--center",
            content: (
              <TableHeader
                currentSort={currentSort}
                onClick={() => updateSort("boot")}
                sortKey="boot"
              >
                Boot
              </TableHeader>
            ),
          },
          {
            content: (
              <TableHeader
                currentSort={currentSort}
                onClick={() => updateSort("size")}
                sortKey="size"
              >
                Size
              </TableHeader>
            ),
          },
          {
            content: (
              <>
                <TableHeader
                  currentSort={currentSort}
                  onClick={() => updateSort("type")}
                  sortKey="type"
                >
                  Type
                </TableHeader>
                <TableHeader>NUMA node</TableHeader>
              </>
            ),
          },
          {
            content: (
              <>
                <TableHeader
                  currentSort={currentSort}
                  onClick={() => updateSort("testStatus")}
                  sortKey="testStatus"
                >
                  Health
                </TableHeader>
                <TableHeader>Tags</TableHeader>
              </>
            ),
          },
          {
            content: <TableHeader>Actions</TableHeader>,
            className: "u-align--right",
          },
        ]}
        rows={sortedStorageDevices.map((storageDevice) => {
          const size = formatBytes(storageDevice.size, "B");
          let boot: ReactNode = "—";
          if (storageDevice.type === "physical") {
            boot = storageDevice.boot ? (
              <i className="p-icon--tick"></i>
            ) : (
              <i className="p-icon--close"></i>
            );
          }

          return {
            columns: [
              {
                content: (
                  <DoubleRow
                    data-test="name"
                    primary={storageDevice.name}
                    secondary={storageDevice.serial}
                  />
                ),
              },
              {
                content: (
                  <DoubleRow
                    data-test="model"
                    primary={storageDevice.model || "—"}
                    secondary={storageDevice.firmware}
                  />
                ),
              },
              {
                content: (
                  <DoubleRow
                    data-test="boot"
                    primary={boot}
                    primaryClassName="u-align--center"
                  />
                ),
              },
              {
                content: (
                  <DoubleRow
                    data-test="size"
                    primary={`${size.value} ${size.unit}`}
                  />
                ),
              },
              {
                content: (
                  <DoubleRow
                    data-test="type"
                    primary={formatType(
                      storageDevice.type,
                      storageDevice.parentType
                    )}
                    secondary={
                      <>
                        {storageDevice.numaNodes.length > 1 && (
                          <Tooltip
                            data-test="numa-warning"
                            message={
                              "This volume is spread over multiple NUMA nodes which may cause suboptimal performance."
                            }
                          >
                            <i className="p-icon--warning is-inline"></i>
                          </Tooltip>
                        )}
                        <span>{storageDevice.numaNodes.join(", ")}</span>
                      </>
                    }
                  />
                ),
              },
              {
                content: (
                  <DoubleRow
                    data-test="health"
                    primary={
                      storageDevice.type === "physical"
                        ? formatTestStatus(storageDevice.testStatus)
                        : "—"
                    }
                    secondary={formatTags(storageDevice.tags)}
                  />
                ),
              },
              { content: "" },
            ],
            key: storageDevice.id,
          };
        })}
      />
      {sortedStorageDevices.length === 0 && (
        <div className="u-nudge-right--small" data-test="no-available">
          No available disks or partitions.
        </div>
      )}
    </>
  );
};

export default AvailableDisksTable;
