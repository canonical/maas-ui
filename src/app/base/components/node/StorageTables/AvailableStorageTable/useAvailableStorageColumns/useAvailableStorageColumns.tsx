import { useMemo } from "react";

import type { ColumnDef, Row } from "@tanstack/react-table";

import DiskBootStatus from "../../../DiskBootStatus";
import DiskNumaNodes from "../../../DiskNumaNodes";
import DiskTestStatus from "../../../DiskTestStatus";
import type { StorageDeviceAction } from "../AvailableStorageTable";
import StorageDeviceActions from "../StorageDeviceActions";

import DoubleRow from "@/app/base/components/DoubleRow";
import TagLinks from "@/app/base/components/TagLinks";
import { useSidePanel } from "@/app/base/side-panel-context";
import urls from "@/app/base/urls";
import { MachineSidePanelViews } from "@/app/machines/constants";
import { FilterControllers } from "@/app/store/controller/utils";
import { FilterMachines } from "@/app/store/machine/utils";
import type { Disk, Node, Partition } from "@/app/store/types/node";
import { formatSize, formatType, isDisk, isPartition } from "@/app/store/utils";

export type AvailableStorageRow = Disk | (Partition & { parentDisk?: Disk });
type AvailableStorageColumnDef = ColumnDef<AvailableStorageRow>;

const useAvailableStorageColumns = ({
  isMachine,
  actionsDisabled,
  systemId,
}: {
  isMachine: boolean;
  actionsDisabled: boolean;
  systemId: Node["system_id"];
}): AvailableStorageColumnDef[] => {
  const { setSidePanelContent } = useSidePanel();

  return useMemo(
    (): AvailableStorageColumnDef[] => [
      {
        id: "name",
        accessorKey: "name",
        enableSorting: false,
        header: () => (
          <div>
            <div>Name</div>
            <div>Serial</div>
          </div>
        ),
        cell: ({ row: { original: disk } }) => (
          <DoubleRow
            primary={disk.name}
            primaryTitle={disk.name}
            secondary={"serial" in disk && disk.serial}
            secondaryClassName={isMachine ? "u-nudge--secondary-row" : null}
            secondaryTitle={"serial" in disk ? disk.serial : null}
          />
        ),
      },
      {
        id: "model",
        accessorKey: "model",
        enableSorting: false,
        header: () => (
          <div>
            <div>Model</div>
            <div>Firmware</div>
          </div>
        ),
        cell: ({ row: { original: disk } }) => (
          <DoubleRow
            primary={"model" in disk ? disk.model : "—"}
            primaryTitle={"model" in disk ? disk.model : null}
            secondary={"firmware_version" in disk && disk.firmware_version}
            secondaryTitle={
              "firmware_version" in disk ? disk.firmware_version : null
            }
          />
        ),
      },
      {
        id: "is_boot",
        accessorKey: "is_boot",
        enableSorting: false,
        header: "Boot",
        cell: ({ row: { original: disk } }) => (
          <DoubleRow
            primary={"is_boot" in disk ? <DiskBootStatus disk={disk} /> : "—"}
          />
        ),
      },
      {
        id: "size",
        accessorKey: "size",
        enableSorting: false,
        header: "Size",
        cell: ({ row: { original: disk } }) => (
          <DoubleRow
            primary={formatSize(disk.size)}
            secondary={
              "available_size" in disk &&
              `Free: ${formatSize(disk.available_size)}`
            }
          />
        ),
      },
      {
        id: "type",
        accessorKey: "type",
        enableSorting: false,
        header: () => (
          <div>
            <div>Type</div>
            <div>NUMA node</div>
          </div>
        ),
        cell: ({ row: { original: disk } }) => (
          <DoubleRow
            primary={formatType(disk)}
            secondary={
              ("numa_node" in disk || "numa_nodes" in disk) && (
                <DiskNumaNodes disk={disk} />
              )
            }
          />
        ),
      },
      {
        id: "health",
        accessorKey: "health",
        enableSorting: false,
        header: () => (
          <div>
            <div>Health</div>
            <div>Tags</div>
          </div>
        ),
        cell: ({ row: { original: disk } }) => (
          <DoubleRow
            primary={
              "test_status" in disk ? (
                <DiskTestStatus testStatus={disk.test_status} />
              ) : (
                "—"
              )
            }
            secondary={
              <TagLinks
                getLinkURL={(tag) => {
                  if (isMachine) {
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
                tags={disk.tags}
              />
            }
          />
        ),
      },
      ...(isMachine
        ? [
            {
              id: "actions",
              accessorKey: "id",
              enableSorting: false,
              header: "Actions",
              cell: ({
                row: { original: disk },
              }: {
                row: Row<AvailableStorageRow>;
              }) => (
                <StorageDeviceActions
                  disabled={actionsDisabled}
                  onActionClick={(_: StorageDeviceAction, view) => {
                    if (view) {
                      if (view === MachineSidePanelViews.EDIT_PARTITION) {
                        setSidePanelContent({
                          view,
                          extras: {
                            systemId,
                            disk:
                              "parentDisk" in disk
                                ? // if disk has parentDisk, then it's a partition, and parentDisk is guarenteed to be a Disk type
                                  disk.parentDisk
                                : undefined,
                            partition: disk,
                          },
                        });
                        return;
                      }
                      setSidePanelContent({
                        view,
                        extras: {
                          systemId,
                          disk: isDisk(disk) ? disk : undefined,
                          partition: isPartition(disk) ? disk : undefined,
                        },
                      });
                    }
                  }}
                  storageDevice={disk}
                  systemId={systemId}
                />
              ),
            },
          ]
        : []),
    ],
    [actionsDisabled, isMachine, setSidePanelContent, systemId]
  );
};

export default useAvailableStorageColumns;
