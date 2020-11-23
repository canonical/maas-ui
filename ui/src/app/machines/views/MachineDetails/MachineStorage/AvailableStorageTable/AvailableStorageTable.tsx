import React from "react";

import { MainTable } from "@canonical/react-components";

import BootStatus from "../BootStatus";
import NumaNodes from "../NumaNodes";
import TagLinks from "../TagLinks";
import TestStatus from "../TestStatus";
import type { NormalisedStorageDevice as StorageDevice } from "../types";
import { formatSize, formatType } from "../utils";

import DoubleRow from "app/base/components/DoubleRow";
import TableHeader from "app/base/components/TableHeader";
import { useTableSort } from "app/base/hooks";

const getSortValue = (
  sortKey: keyof StorageDevice,
  storageDevice: StorageDevice
) => storageDevice[sortKey];

type Props = { storageDevices: StorageDevice[] };

const AvailableStorageTable = ({ storageDevices }: Props): JSX.Element => {
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
            className: "u-align--right",
            content: <TableHeader>Actions</TableHeader>,
          },
        ]}
        rows={sortedStorageDevices.map((storageDevice) => {
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
                    primary={<BootStatus storageDevice={storageDevice} />}
                    primaryClassName="u-align--center"
                  />
                ),
              },
              {
                content: (
                  <DoubleRow
                    data-test="size"
                    primary={formatSize(storageDevice.size)}
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
                      <NumaNodes numaNodes={storageDevice.numaNodes} />
                    }
                  />
                ),
              },
              {
                content: (
                  <DoubleRow
                    data-test="health"
                    primary={
                      <TestStatus testStatus={storageDevice.testStatus} />
                    }
                    secondary={<TagLinks tags={storageDevice.tags} />}
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

export default AvailableStorageTable;
