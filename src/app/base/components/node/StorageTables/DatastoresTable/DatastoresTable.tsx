import { useState } from "react";

import { MainTable } from "@canonical/react-components";
import type { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";
import { useDispatch } from "react-redux";

import TableActionsDropdown from "app/base/components/TableActionsDropdown";
import ActionConfirm from "app/base/components/node/ActionConfirm";
import type { ControllerDetails } from "app/store/controller/types";
import { actions as machineActions } from "app/store/machine";
import type { MachineDetails } from "app/store/machine/types";
import { formatSize, isDatastore, nodeIsMachine } from "app/store/utils";

export enum DatastoreAction {
  DELETE = "deleteDisk",
}

type Expanded = {
  content: DatastoreAction;
  id: string;
};

type Props = {
  canEditStorage: boolean;
  node: ControllerDetails | MachineDetails;
};

const DatastoresTable = ({ canEditStorage, node }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState<Expanded | null>(null);
  const isMachine = nodeIsMachine(node);
  const closeExpanded = () => setExpanded(null);

  const headers = [
    { content: "Name" },
    { content: "Filesystem" },
    { content: "Size" },
    { content: "Mount point" },
    {
      content: "Actions",
      className: "u-align--right",
    },
  ];

  const rows = node.disks.reduce<MainTableRow[]>((rows, disk) => {
    if (disk.filesystem && isDatastore(disk.filesystem)) {
      const fs = disk.filesystem;
      const rowId = `${fs.fstype}-${fs.id}`;
      const isExpanded = expanded?.id === rowId && Boolean(expanded?.content);
      rows.push({
        className: isExpanded ? "p-table__row is-active" : null,
        columns: [
          { content: disk.name },
          { content: fs.fstype },
          { content: formatSize(disk.size) },
          { content: fs.mount_point },
          ...(isMachine
            ? [
                {
                  content: (
                    <TableActionsDropdown
                      actions={[
                        {
                          label: "Remove datastore...",
                          type: DatastoreAction.DELETE,
                        },
                      ]}
                      disabled={!canEditStorage}
                      onActionClick={(action: DatastoreAction) =>
                        setExpanded({ content: action, id: rowId })
                      }
                    />
                  ),
                  className: "u-align--right",
                },
              ]
            : []),
        ].map((column, i) => ({
          ...column,
          "aria-label": headers[i].content,
        })),
        expanded: isExpanded,
        expandedContent: isMachine ? (
          <div className="u-flex--grow">
            {expanded?.content === "deleteDisk" && (
              <ActionConfirm
                closeExpanded={closeExpanded}
                confirmLabel="Remove datastore"
                eventName="deleteDisk"
                message="Are you sure you want to remove this datastore? ESXi requires at least one VMFS datastore to deploy."
                onConfirm={() => {
                  dispatch(machineActions.cleanup());
                  dispatch(
                    machineActions.deleteDisk({
                      blockId: disk.id,
                      systemId: node.system_id,
                    })
                  );
                }}
                onSaveAnalytics={{
                  action: "Delete datastore",
                  category: "Machine storage",
                  label: "Remove datastore",
                }}
                statusKey="deletingDisk"
                systemId={node.system_id}
              />
            )}
          </div>
        ) : null,
        key: rowId,
      });
    }
    return rows;
  }, []);

  return (
    <>
      <MainTable
        className="p-table-expanding--light"
        expanding
        responsive
        headers={isMachine ? headers : headers.slice(0, -1)}
        rows={rows}
      />
      {rows.length === 0 && (
        <div className="u-nudge-right--small" data-testid="no-datastores">
          No datastores detected.
        </div>
      )}
    </>
  );
};

export default DatastoresTable;
