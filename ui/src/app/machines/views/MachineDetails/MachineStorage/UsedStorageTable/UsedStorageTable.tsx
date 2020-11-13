import { MainTable, Tooltip } from "@canonical/react-components";
import React from "react";
import type { ReactNode } from "react";

import DoubleRow from "app/base/components/DoubleRow";
import TableHeader from "app/base/components/TableHeader";
import { useTableSort } from "app/base/hooks";
import { formatBytes } from "app/utils";
import type { NormalisedStorageDevice as StorageDevice } from "../types";
import { formatTags, formatTestStatus, formatType } from "../MachineStorage";

const getSortValue = (
  sortKey: keyof StorageDevice,
  storageDevice: StorageDevice
) => storageDevice[sortKey];

type Props = { storageDevices: StorageDevice[] };

const UsedStorageTable = ({ storageDevices }: Props): JSX.Element => {
  const { currentSort, sortRows, updateSort } = useTableSort(getSortValue, {
    key: "name",
    direction: "descending",
  });
  // TODO: update useTableSort to TS with generics
  // https://github.com/canonical-web-and-design/maas-ui/issues/1869
  const sortedStorageDevices = sortRows(storageDevices) as StorageDevice[];

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
            content: <TableHeader>Used for</TableHeader>,
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
              {
                content: (
                  <span data-test="used-for">
                    {storageDevice.usedFor || "—"}
                  </span>
                ),
              },
            ],
            key: storageDevice.id,
          };
        })}
      />
      {sortedStorageDevices.length === 0 && (
        <div className="u-nudge-right--small" data-test="no-used">
          No disk or partition has been fully utilised.
        </div>
      )}
    </>
  );
};

export default UsedStorageTable;
