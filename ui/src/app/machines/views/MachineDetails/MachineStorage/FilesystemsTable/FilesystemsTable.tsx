import { useState } from "react";

import { Button, MainTable, Tooltip } from "@canonical/react-components";
import { useDispatch } from "react-redux";

import ActionConfirm from "../ActionConfirm";
import type { NormalisedFilesystem } from "../types";
import { formatSize } from "../utils";

import AddSpecialFilesystem from "./AddSpecialFilesystem";

import TableMenu from "app/base/components/TableMenu";
import { actions as machineActions } from "app/store/machine";
import type { Machine, MachineStatus } from "app/store/machine/types";

type Expanded = {
  content: "removeFilesystem";
  id: number;
};

type Props = {
  canEditStorage: boolean;
  filesystems: NormalisedFilesystem[];
  systemId: Machine["system_id"];
};

/**
 * Generate the actions that a given filesystem can perform.
 * @param filesystem - the filesystem to check.
 * @param setExpanded - function to set the expanded table row and content.
 * @returns list of action links.
 */
const getActionLinks = (
  filesystem: NormalisedFilesystem,
  setExpanded: (expanded: Expanded) => void
) => {
  const actionLinks = [];

  if (filesystem.actions.includes("remove")) {
    actionLinks.push({
      children: "Remove filesystem...",
      onClick: () => {
        setExpanded({
          content: "removeFilesystem",
          id: filesystem.id,
        });
      },
    });
  }

  return actionLinks;
};

const FilesystemsTable = ({
  canEditStorage,
  filesystems,
  systemId,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const [addSpecialFormOpen, setAddSpecialFormOpen] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<Expanded | null>(null);

  const closeAddSpecialForm = () => setAddSpecialFormOpen(false);
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
        rows={filesystems.map((fs) => {
          const actionLinks = getActionLinks(fs, setExpanded);
          let removeAction: { payload: unknown; type: string };
          let removeStatusKey: keyof MachineStatus;

          if (fs.parentType === null) {
            removeAction = machineActions.unmountSpecial({
              mountPoint: fs.mountPoint,
              systemId,
            });
            removeStatusKey = "unmountingSpecial";
          } else if (fs.parentType === "partition") {
            removeAction = machineActions.deletePartition({
              partitionId: fs.parentId,
              systemId,
            });
            removeStatusKey = "deletingPartition";
          } else {
            removeAction = machineActions.deleteFilesystem({
              blockId: fs.parentId,
              filesystemId: fs.id,
              systemId,
            });
            removeStatusKey = "deletingFilesystem";
          }

          return {
            className: expanded?.id === fs.id ? "p-table__row is-active" : null,
            columns: [
              { content: fs.name || "—" },
              {
                content: formatSize(fs.size),
              },
              { content: fs.fstype },
              { content: fs.mountPoint },
              { content: fs.mountOptions },
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
            expanded: expanded?.id === fs.id,
            expandedContent: expanded?.content && (
              <div className="u-flex--grow">
                {expanded.content === "removeFilesystem" && (
                  <ActionConfirm
                    closeExpanded={closeExpanded}
                    confirmLabel="Remove"
                    message="Are you sure you want to remove this filesystem?"
                    onConfirm={() => dispatch(removeAction)}
                    onSaveAnalytics={{
                      action: "Remove filesystem",
                      category: "Machine storage",
                      label: "Remove",
                    }}
                    statusKey={removeStatusKey}
                    systemId={systemId}
                  />
                )}
              </div>
            ),
            key: fs.id,
            sortData: {
              mountPoint: fs.mountPoint,
              name: fs.name,
              size: fs.size,
              fstype: fs.fstype,
            },
          };
        })}
        sortable
      />
      {filesystems.length === 0 && (
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
};

export default FilesystemsTable;
