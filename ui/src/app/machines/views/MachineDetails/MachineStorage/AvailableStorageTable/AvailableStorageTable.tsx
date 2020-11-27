import { useState } from "react";

import { MainTable } from "@canonical/react-components";

import BootStatus from "../BootStatus";
import NumaNodes from "../NumaNodes";
import TagLinks from "../TagLinks";
import TestStatus from "../TestStatus";
import type { NormalisedStorageDevice as StorageDevice } from "../types";
import { formatSize, formatType } from "../utils";

import AddPartition from "./AddPartition";

import DoubleRow from "app/base/components/DoubleRow";
import TableHeader from "app/base/components/TableHeader";
import TableMenu from "app/base/components/TableMenu";
import { useTableSort } from "app/base/hooks";
import type { Machine } from "app/store/machine/types";

type Expanded = {
  content: "addPartition";
  id: number;
};

type Props = {
  canEditStorage: boolean;
  storageDevices: StorageDevice[];
  systemId: Machine["system_id"];
};

/**
 * Generate the actions that a given storage device can perform.
 * @param storageDevice - the storage device to check.
 * @param setExpanded - function to set the expanded table row and content.
 * @returns list of action links.
 */
const getActionLinks = (
  storageDevice: StorageDevice,
  setExpanded: (expanded: Expanded) => void
) => {
  const actionLinks = [];

  if (storageDevice.actions.includes("addPartition")) {
    actionLinks.push({
      children: "Add partition...",
      onClick: () => {
        setExpanded({
          content: "addPartition",
          id: storageDevice.id,
        });
      },
    });
  }

  return actionLinks;
};

const getSortValue = (
  sortKey: keyof StorageDevice,
  storageDevice: StorageDevice
) => storageDevice[sortKey];

const AvailableStorageTable = ({
  canEditStorage,
  storageDevices,
  systemId,
}: Props): JSX.Element => {
  const [expanded, setExpanded] = useState<Expanded | null>(null);
  const { currentSort, sortRows, updateSort } = useTableSort(getSortValue, {
    key: "name",
    direction: "descending",
  });
  // TODO: update useTableSort to TS with generics
  // https://github.com/canonical-web-and-design/maas-ui/issues/1869
  const sortedStorageDevices = sortRows(storageDevices) as StorageDevice[];
  const closeExpanded = () => setExpanded(null);

  return (
    <>
      <MainTable
        className="p-table-expanding--light"
        defaultSort="name"
        defaultSortDirection="ascending"
        expanding
        headers={[
          {
            content: (
              <div>
                <TableHeader
                  currentSort={currentSort}
                  onClick={() => updateSort("name")}
                  sortKey="name"
                >
                  Name
                </TableHeader>
                <TableHeader>Serial</TableHeader>
              </div>
            ),
          },
          {
            content: (
              <div>
                <TableHeader
                  currentSort={currentSort}
                  onClick={() => updateSort("model")}
                  sortKey="model"
                >
                  Model
                </TableHeader>
                <TableHeader>Firmware</TableHeader>
              </div>
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
              <div>
                <TableHeader
                  currentSort={currentSort}
                  onClick={() => updateSort("type")}
                  sortKey="type"
                >
                  Type
                </TableHeader>
                <TableHeader>NUMA node</TableHeader>
              </div>
            ),
          },
          {
            content: (
              <div>
                <TableHeader
                  currentSort={currentSort}
                  onClick={() => updateSort("testStatus")}
                  sortKey="testStatus"
                >
                  Health
                </TableHeader>
                <TableHeader>Tags</TableHeader>
              </div>
            ),
          },
          {
            className: "u-align--right",
            content: <TableHeader>Actions</TableHeader>,
          },
        ]}
        rows={sortedStorageDevices.map((storageDevice) => {
          const actionLinks = getActionLinks(storageDevice, setExpanded);

          return {
            className:
              expanded?.id === storageDevice.id
                ? "p-table__row is-active"
                : null,
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
                className: "u-align--center",
                content: (
                  <DoubleRow
                    data-test="boot"
                    primary={<BootStatus storageDevice={storageDevice} />}
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
              {
                className: "u-align--right",
                content: (
                  <TableMenu
                    disabled={!canEditStorage || actionLinks.length === 0}
                    links={actionLinks}
                    position="right"
                    title="Take action:"
                  />
                ),
              },
            ],
            expanded: expanded?.id === storageDevice.id,
            expandedContent: expanded?.content ? (
              <div className="u-flex--grow">
                {expanded.content === "addPartition" && (
                  <AddPartition
                    closeExpanded={closeExpanded}
                    diskId={storageDevice.id}
                    systemId={systemId}
                  />
                )}
              </div>
            ) : null,
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
