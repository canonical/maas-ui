import { useState } from "react";

import { Button, MainTable, Tooltip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import ActionConfirm from "../../ActionConfirm";

import AddSpecialFilesystem from "./AddSpecialFilesystem";

import TableActionsDropdown from "app/base/components/TableActionsDropdown";
import type { TSFixMe } from "app/base/types";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type {
  Disk,
  Filesystem,
  Machine,
  Partition,
} from "app/store/machine/types";
import { formatSize, isMounted, usesStorage } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

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
  systemId: Machine["system_id"];
};

/**
 * Normalise rendered row data so that both disk and partition filesystems can
 * be displayed.
 * @param rowId - the row ID of the filesystem.
 * @param fs - the filesystem to normalise.
 * @param storageDevice - the storage device the filesystem belongs to.
 * @param expanded - the currently expanded row and content.
 * @param setExpanded - function to set the expanded table row and content.
 * @returns normalised row data
 */
const normaliseRowData = (
  rowId: string,
  fs: Filesystem,
  storageDevice: Disk | Partition | null,
  expanded: Expanded | null,
  setExpanded: (expanded: Expanded | null) => void
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
      {
        className: "u-align--right",
        content: (
          <TableActionsDropdown
            actions={[
              {
                label: "Unmount filesystem...",
                show: usesStorage(fs),
                type: FilesystemAction.UNMOUNT,
              },
              {
                label: "Remove filesystem...",
                type: FilesystemAction.DELETE,
              },
            ]}
            onActionClick={(action: FilesystemAction) =>
              setExpanded({ content: action, id: rowId })
            }
          />
        ),
      },
    ],
    expanded: isExpanded,
    key: rowId,
  };
};

const FilesystemsTable = ({
  canEditStorage,
  systemId,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const [addSpecialFormOpen, setAddSpecialFormOpen] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<Expanded | null>(null);

  const closeAddSpecialForm = () => setAddSpecialFormOpen(false);

  if (machine && "disks" in machine && "special_filesystems" in machine) {
    const rows = machine.disks.reduce<TSFixMe[]>((rows, disk) => {
      const diskFs = disk.filesystem;

      if (isMounted(diskFs)) {
        const rowId = `${diskFs.fstype}-${diskFs.id}`;

        rows.push({
          ...normaliseRowData(rowId, diskFs, disk, expanded, setExpanded),
          expandedContent: (
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
                        systemId,
                      })
                    );
                  }}
                  onSaveAnalytics={{
                    action: "Delete disk filesystem",
                    category: "Machine storage",
                    label: "Remove",
                  }}
                  statusKey="deletingFilesystem"
                  systemId={systemId}
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
                        systemId,
                      })
                    );
                  }}
                  onSaveAnalytics={{
                    action: "Unmount disk filesystem",
                    category: "Machine storage",
                    label: "Unmount",
                  }}
                  statusKey="updatingFilesystem"
                  systemId={systemId}
                />
              )}
            </div>
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
                expanded,
                setExpanded
              ),
              expandedContent: (
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
                            systemId,
                          })
                        );
                      }}
                      onSaveAnalytics={{
                        action: "Delete partition filesystem",
                        category: "Machine storage",
                        label: "Remove",
                      }}
                      statusKey="deletingPartition"
                      systemId={systemId}
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
                            systemId,
                          })
                        );
                      }}
                      onSaveAnalytics={{
                        action: "Unmount partition filesystem",
                        category: "Machine storage",
                        label: "Unmount",
                      }}
                      statusKey="updatingFilesystem"
                      systemId={systemId}
                    />
                  )}
                </div>
              ),
            });
          }
        });
      }
      return rows;
    }, []);

    if (machine.special_filesystems) {
      machine.special_filesystems.forEach((specialFs) => {
        const rowId = `${specialFs.fstype}-${specialFs.id}`;

        rows.push({
          ...normaliseRowData(rowId, specialFs, null, expanded, setExpanded),
          expandedContent: (
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
                        systemId,
                      })
                    );
                  }}
                  onSaveAnalytics={{
                    action: "Unmount special filesystem",
                    category: "Machine storage",
                    label: "Remove",
                  }}
                  statusKey="unmountingSpecial"
                  systemId={systemId}
                />
              )}
            </div>
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
          headers={[
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
          ]}
          rows={rows}
        />
        {rows.length === 0 && (
          <p className="u-nudge-right--small u-sv1" data-test="no-filesystems">
            No filesystems defined.
          </p>
        )}
        {canEditStorage && !addSpecialFormOpen && (
          <Tooltip message="Create a tmpfs or ramfs filesystem.">
            <Button
              appearance="neutral"
              data-test="add-special-fs-button"
              onClick={() => setAddSpecialFormOpen(true)}
            >
              Add special filesystem
            </Button>
          </Tooltip>
        )}
        {addSpecialFormOpen && (
          <AddSpecialFilesystem
            closeForm={closeAddSpecialForm}
            systemId={systemId}
          />
        )}
      </>
    );
  }
  return null;
};

export default FilesystemsTable;
