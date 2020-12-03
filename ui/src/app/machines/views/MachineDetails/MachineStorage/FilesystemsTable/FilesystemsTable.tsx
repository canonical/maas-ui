import { useState } from "react";

import { Button, MainTable, Tooltip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import ActionConfirm from "../ActionConfirm";
import { formatSize, isMounted, usesStorage } from "../utils";

import AddSpecialFilesystem from "./AddSpecialFilesystem";

import TableMenu from "app/base/components/TableMenu";
import type { TSFixMe } from "app/base/types";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type {
  Disk,
  Filesystem,
  Machine,
  Partition,
} from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type Expanded = {
  content: "remove" | "unmount";
  id: string;
};

type Props = {
  canEditStorage: boolean;
  systemId: Machine["system_id"];
};

/**
 * Generate the actions that a given filesystem can perform.
 * @param fs - the filesystem to check.
 * @param setExpanded - function to set the expanded table row and content.
 * @returns list of action links.
 */
const getFsActions = (
  rowId: string,
  fs: Filesystem,
  setExpanded: (expanded: Expanded | null) => void
) => {
  const actions = [];
  const actionGenerator = (label: string, content: Expanded["content"]) => ({
    children: label,
    onClick: () => setExpanded({ content, id: rowId }),
  });

  if (usesStorage(fs)) {
    actions.push(actionGenerator("Unmount filesystem...", "unmount"));
  }
  actions.push(actionGenerator("Remove filesystem...", "remove"));

  return actions;
};

const normaliseRowData = (
  rowId: string,
  fs: Filesystem,
  storageDevice: Disk | Partition | null,
  expanded: Expanded | null,
  actions: TSFixMe[] // Replace TSFixMe with TableMenu actions type when converted to TS
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
          <TableMenu
            disabled={actions.length === 0}
            links={actions}
            position="right"
            title="Take action:"
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
        const diskFsActions = getFsActions(rowId, diskFs, setExpanded);

        rows.push({
          ...normaliseRowData(rowId, diskFs, disk, expanded, diskFsActions),
          expandedContent: (
            <div className="u-flex--grow">
              {expanded?.content === "remove" && (
                <ActionConfirm
                  closeExpanded={() => setExpanded(null)}
                  confirmLabel="Remove"
                  message="Are you sure you want to remove this filesystem?"
                  onConfirm={() =>
                    dispatch(
                      machineActions.deleteFilesystem({
                        blockDeviceId: disk.id,
                        filesystemId: diskFs.id,
                        systemId,
                      })
                    )
                  }
                  onSaveAnalytics={{
                    action: "Delete disk filesystem",
                    category: "Machine storage",
                    label: "Remove",
                  }}
                  statusKey="deletingFilesystem"
                  systemId={systemId}
                />
              )}
              {expanded?.content === "unmount" && (
                <ActionConfirm
                  closeExpanded={() => setExpanded(null)}
                  confirmLabel="Unmount"
                  message="Are you sure you want to unmount this filesystem?"
                  onConfirm={() =>
                    dispatch(
                      machineActions.updateFilesystem({
                        blockId: disk.id,
                        mountOptions: "",
                        mountPoint: "",
                        systemId,
                      })
                    )
                  }
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
            const partitionFsActions = getFsActions(
              rowId,
              partitionFs,
              setExpanded
            );

            rows.push({
              ...normaliseRowData(
                rowId,
                partitionFs,
                partition,
                expanded,
                partitionFsActions
              ),
              expandedContent: (
                <div className="u-flex--grow">
                  {expanded?.content === "remove" && (
                    <ActionConfirm
                      closeExpanded={() => setExpanded(null)}
                      confirmLabel="Remove"
                      message="Are you sure you want to remove this filesystem?"
                      onConfirm={() =>
                        dispatch(
                          machineActions.deletePartition({
                            partitionId: partition.id,
                            systemId,
                          })
                        )
                      }
                      onSaveAnalytics={{
                        action: "Delete partition filesystem",
                        category: "Machine storage",
                        label: "Remove",
                      }}
                      statusKey="deletingPartition"
                      systemId={systemId}
                    />
                  )}
                  {expanded?.content === "unmount" && (
                    <ActionConfirm
                      closeExpanded={() => setExpanded(null)}
                      confirmLabel="Unmount"
                      message="Are you sure you want to unmount this filesystem?"
                      onConfirm={() =>
                        dispatch(
                          machineActions.updateFilesystem({
                            mountOptions: "",
                            mountPoint: "",
                            partitionId: partition.id,
                            systemId,
                          })
                        )
                      }
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
        const specialFsActions = getFsActions(rowId, specialFs, setExpanded);

        rows.push({
          ...normaliseRowData(
            rowId,
            specialFs,
            null,
            expanded,
            specialFsActions
          ),
          expandedContent: (
            <div className="u-flex--grow">
              {expanded?.content === "remove" && (
                <ActionConfirm
                  closeExpanded={() => setExpanded(null)}
                  confirmLabel="Remove"
                  message="Are you sure you want to remove this special filesystem?"
                  onConfirm={() =>
                    dispatch(
                      machineActions.unmountSpecial({
                        mountPoint: specialFs.mount_point,
                        systemId,
                      })
                    )
                  }
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
