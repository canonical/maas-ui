import { Button, MainTable, Tooltip } from "@canonical/react-components";
import type { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";

import TableActionsDropdown from "@/app/base/components/TableActionsDropdown";
import { useSidePanel } from "@/app/base/side-panel-context";
import type { SetSidePanelContent } from "@/app/base/side-panel-context";
import { MachineSidePanelViews } from "@/app/machines/constants";
import type { ControllerDetails } from "@/app/store/controller/types";
import type { MachineDetails } from "@/app/store/machine/types";
import type { Filesystem, Disk, Partition } from "@/app/store/types/node";
import {
  formatSize,
  isMounted,
  nodeIsMachine,
  usesStorage,
} from "@/app/store/utils";

export enum FilesystemAction {
  DELETE = "deleteFilesystem",
  UNMOUNT = "unmountFilesystem",
}

type Props = {
  canEditStorage: boolean;
  node: ControllerDetails | MachineDetails;
};

const headers = [
  {
    content: "Name",
    sortKey: "name",
  },
  {
    content: "Size",
    sortKey: "size",
  },
  {
    content: "Filesystem",
    sortKey: "fstype",
  },
  {
    content: "Mount point",
    sortKey: "mountPoint",
  },
  {
    content: "Mount options",
  },
  {
    content: "Actions",
    className: "u-align--right",
  },
];

/**
 * Normalise rendered row data so that both disk and partition filesystems can
 * be displayed.
 * @param rowId - the row ID of the filesystem.
 * @param fs - the filesystem to normalise.
 * @param storageDevice - the storage device the filesystem belongs to.
 * @param expanded - the currently expanded row and content.
 * @param setExpanded - function to set the expanded table row and content.
 * @param isMachine - whether the node is a machine or not.
 * @returns normalised row data
 */
const normaliseRowData = (
  rowId: string,
  fs: Filesystem,
  storageDevice: Disk | Partition | null,
  canEditStorage: Props["canEditStorage"],
  isMachine: boolean,
  node: Props["node"],
  setSidePanelContent: SetSidePanelContent
) => {
  return {
    columns: [
      { content: storageDevice?.name || "—" },
      { content: storageDevice ? formatSize(storageDevice.size) : "—" },
      { content: fs.fstype },
      { content: fs.mount_point },
      { content: fs.mount_options },
      ...(isMachine
        ? [
            {
              className: "u-align--right",
              content: (
                <TableActionsDropdown
                  actions={[
                    {
                      label: "Unmount filesystem...",
                      show: usesStorage(fs.fstype),
                      type: FilesystemAction.UNMOUNT,
                      view: MachineSidePanelViews.UNMOUNT_FILESYSTEM,
                    },
                    {
                      label: "Remove filesystem...",
                      type: FilesystemAction.DELETE,
                      view:
                        node.special_filesystems && !storageDevice
                          ? MachineSidePanelViews.DELETE_SPECIAL_FILESYSTEM
                          : MachineSidePanelViews.DELETE_FILESYSTEM,
                    },
                  ]}
                  disabled={!canEditStorage}
                  onActionClick={(_, view) => {
                    if (view) {
                      if (
                        node.special_filesystems &&
                        view === MachineSidePanelViews.DELETE_SPECIAL_FILESYSTEM
                      ) {
                        setSidePanelContent({
                          view,
                          extras: {
                            systemId: node.system_id,
                            mountPoint: fs.mount_point,
                          },
                        });
                        return;
                      }
                      setSidePanelContent({
                        view,
                        extras: {
                          systemId: node.system_id,
                          storageDevice,
                        },
                      });
                    }
                  }}
                />
              ),
            },
          ]
        : []),
    ].map((column, i) => ({ ...column, "aria-label": headers[i].content })),
    key: rowId,
  };
};

const FilesystemsTable = ({
  canEditStorage,
  node,
}: Props): React.ReactElement | null => {
  const isMachine = nodeIsMachine(node);
  const { setSidePanelContent } = useSidePanel();

  const rows = node.disks.reduce<MainTableRow[]>((rows, disk) => {
    const diskFs = disk.filesystem;

    if (isMounted(diskFs)) {
      const rowId = `${diskFs.fstype}-${diskFs.id}`;

      rows.push({
        ...normaliseRowData(
          rowId,
          diskFs,
          disk,
          canEditStorage,
          isMachine,
          node,
          setSidePanelContent
        ),
      });
    }

    if (disk.partitions) {
      disk.partitions.forEach((partition) => {
        const partitionFs = partition.filesystem;

        if (isMounted(partitionFs)) {
          const rowId = `${partitionFs.fstype}-${partitionFs.id}`;

          rows.push({
            ...normaliseRowData(
              rowId,
              partitionFs,
              partition,
              canEditStorage,
              isMachine,
              node,
              setSidePanelContent
            ),
          });
        }
      });
    }
    return rows;
  }, []);

  if (node.special_filesystems) {
    node.special_filesystems.forEach((specialFs) => {
      const rowId = `${specialFs.fstype}-${specialFs.id}`;

      rows.push({
        ...normaliseRowData(
          rowId,
          specialFs,
          null,
          canEditStorage,
          isMachine,
          node,
          setSidePanelContent
        ),
      });
    });
  }

  return (
    <>
      <MainTable
        className="p-table-expanding--light"
        defaultSort="name"
        defaultSortDirection="ascending"
        expanding
        headers={isMachine ? headers : headers.slice(0, -1)}
        responsive
        rows={rows}
      />
      {rows.length === 0 && (
        <p className="u-nudge-right--small u-sv1" data-testid="no-filesystems">
          No filesystems defined.
        </p>
      )}
      {canEditStorage && (
        <Tooltip message="Create a tmpfs or ramfs filesystem.">
          <Button
            data-testid="add-special-fs-button"
            onClick={() => {
              isMachine &&
                setSidePanelContent({
                  view: MachineSidePanelViews.ADD_SPECIAL_FILESYSTEM,
                  extras: { node },
                });
            }}
          >
            Add special filesystem
          </Button>
        </Tooltip>
      )}
    </>
  );
};

export default FilesystemsTable;
