import { useState } from "react";

import { Button, MainTable, Tooltip } from "@canonical/react-components";
import type { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";
import { useDispatch } from "react-redux";

import AddSpecialFilesystem from "./AddSpecialFilesystem";

import TableActionsDropdown from "app/base/components/TableActionsDropdown";
import ActionConfirm from "app/base/components/node/ActionConfirm";
import type { ControllerDetails } from "app/store/controller/types";
import { actions as machineActions } from "app/store/machine";
import type { MachineDetails } from "app/store/machine/types";
import type { Filesystem, Disk, Partition } from "app/store/types/node";
import {
  formatSize,
  isMounted,
  nodeIsMachine,
  usesStorage,
} from "app/store/utils";

export enum FilesystemAction {
  DELETE = "deleteFilesystem",
  UNMOUNT = "unmountFilesystem",
}

type Expanded = {
  content: FilesystemAction;
  id: string;
};

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
  expanded: Expanded | null,
  setExpanded: (expanded: Expanded | null) => void,
  canEditStorage: Props["canEditStorage"],
  isMachine: boolean
) => {
  const isExpanded = expanded?.id === rowId && Boolean(expanded?.content);

  return {
    className: isExpanded ? "p-table__row is-active" : null,
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
                    },
                    {
                      label: "Remove filesystem...",
                      type: FilesystemAction.DELETE,
                    },
                  ]}
                  disabled={!canEditStorage}
                  onActionClick={(action: FilesystemAction) =>
                    setExpanded({ content: action, id: rowId })
                  }
                />
              ),
            },
          ]
        : []),
    ].map((column, i) => ({ ...column, "aria-label": headers[i].content })),
    expanded: isExpanded,
    key: rowId,
  };
};

const FilesystemsTable = ({
  canEditStorage,
  node,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const [addSpecialFormOpen, setAddSpecialFormOpen] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<Expanded | null>(null);
  const isMachine = nodeIsMachine(node);
  const closeAddSpecialForm = () => setAddSpecialFormOpen(false);

  const rows = node.disks.reduce<MainTableRow[]>((rows, disk) => {
    const diskFs = disk.filesystem;

    if (isMounted(diskFs)) {
      const rowId = `${diskFs.fstype}-${diskFs.id}`;

      rows.push({
        ...normaliseRowData(
          rowId,
          diskFs,
          disk,
          expanded,
          setExpanded,
          canEditStorage,
          isMachine
        ),
        expandedContent: isMachine ? (
          <div className="u-flex--grow">
            {expanded?.content === FilesystemAction.DELETE && (
              <ActionConfirm
                closeExpanded={() => setExpanded(null)}
                confirmLabel="Remove"
                eventName="deleteFilesystem"
                message="Are you sure you want to remove this filesystem?"
                onConfirm={() => {
                  dispatch(machineActions.cleanup());
                  dispatch(
                    machineActions.deleteFilesystem({
                      blockDeviceId: disk.id,
                      filesystemId: diskFs.id,
                      systemId: node.system_id,
                    })
                  );
                }}
                onSaveAnalytics={{
                  action: "Delete disk filesystem",
                  category: "Machine storage",
                  label: "Remove",
                }}
                statusKey="deletingFilesystem"
                systemId={node.system_id}
              />
            )}
            {expanded?.content === FilesystemAction.UNMOUNT && (
              <ActionConfirm
                closeExpanded={() => setExpanded(null)}
                confirmLabel="Unmount"
                eventName="updateFilesystem"
                message="Are you sure you want to unmount this filesystem?"
                onConfirm={() => {
                  dispatch(machineActions.cleanup());
                  dispatch(
                    machineActions.updateFilesystem({
                      blockId: disk.id,
                      mountOptions: "",
                      mountPoint: "",
                      systemId: node.system_id,
                    })
                  );
                }}
                onSaveAnalytics={{
                  action: "Unmount disk filesystem",
                  category: "Machine storage",
                  label: "Unmount",
                }}
                statusKey="updatingFilesystem"
                systemId={node.system_id}
              />
            )}
          </div>
        ) : null,
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
              expanded,
              setExpanded,
              canEditStorage,
              isMachine
            ),
            expandedContent: isMachine ? (
              <div className="u-flex--grow">
                {expanded?.content === FilesystemAction.DELETE && (
                  <ActionConfirm
                    closeExpanded={() => setExpanded(null)}
                    confirmLabel="Remove"
                    eventName="deletePartition"
                    message="Are you sure you want to remove this filesystem?"
                    onConfirm={() => {
                      dispatch(machineActions.cleanup());
                      dispatch(
                        machineActions.deletePartition({
                          partitionId: partition.id,
                          systemId: node.system_id,
                        })
                      );
                    }}
                    onSaveAnalytics={{
                      action: "Delete partition filesystem",
                      category: "Machine storage",
                      label: "Remove",
                    }}
                    statusKey="deletingPartition"
                    systemId={node.system_id}
                  />
                )}
                {expanded?.content === FilesystemAction.UNMOUNT && (
                  <ActionConfirm
                    closeExpanded={() => setExpanded(null)}
                    confirmLabel="Unmount"
                    eventName="updateFilesystem"
                    message="Are you sure you want to unmount this filesystem?"
                    onConfirm={() => {
                      dispatch(machineActions.cleanup());
                      dispatch(
                        machineActions.updateFilesystem({
                          mountOptions: "",
                          mountPoint: "",
                          partitionId: partition.id,
                          systemId: node.system_id,
                        })
                      );
                    }}
                    onSaveAnalytics={{
                      action: "Unmount partition filesystem",
                      category: "Machine storage",
                      label: "Unmount",
                    }}
                    statusKey="updatingFilesystem"
                    systemId={node.system_id}
                  />
                )}
              </div>
            ) : null,
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
          expanded,
          setExpanded,
          canEditStorage,
          isMachine
        ),
        expandedContent: isMachine ? (
          <div className="u-flex--grow">
            {expanded?.content === FilesystemAction.DELETE && (
              <ActionConfirm
                closeExpanded={() => setExpanded(null)}
                confirmLabel="Remove"
                eventName="unmountSpecial"
                message="Are you sure you want to remove this special filesystem?"
                onConfirm={() => {
                  dispatch(machineActions.cleanup());
                  dispatch(
                    machineActions.unmountSpecial({
                      mountPoint: specialFs.mount_point,
                      systemId: node.system_id,
                    })
                  );
                }}
                onSaveAnalytics={{
                  action: "Unmount special filesystem",
                  category: "Machine storage",
                  label: "Remove",
                }}
                statusKey="unmountingSpecial"
                systemId={node.system_id}
              />
            )}
          </div>
        ) : null,
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
      {canEditStorage && !addSpecialFormOpen && (
        <Tooltip message="Create a tmpfs or ramfs filesystem.">
          <Button
            data-testid="add-special-fs-button"
            onClick={() => setAddSpecialFormOpen(true)}
          >
            Add special filesystem
          </Button>
        </Tooltip>
      )}
      {isMachine && addSpecialFormOpen && (
        <AddSpecialFilesystem closeForm={closeAddSpecialForm} machine={node} />
      )}
    </>
  );
};

export default FilesystemsTable;
