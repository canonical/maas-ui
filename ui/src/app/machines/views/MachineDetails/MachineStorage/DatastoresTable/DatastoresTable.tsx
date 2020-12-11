import { useState } from "react";

import { MainTable } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import ActionConfirm from "../ActionConfirm";

import TableMenu from "app/base/components/TableMenu";
import type { TSFixMe } from "app/base/types";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import { formatSize, isDatastore } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

type Expanded = {
  content: "deleteDisk";
  id: string;
};

type Props = {
  canEditStorage: boolean;
  systemId: Machine["system_id"];
};

const DatastoresTable = ({
  canEditStorage,
  systemId,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const [expanded, setExpanded] = useState<Expanded | null>(null);

  const closeExpanded = () => setExpanded(null);

  if (machine && "disks" in machine) {
    const rows = machine.disks.reduce<TSFixMe[]>((rows, disk) => {
      if (isDatastore(disk.filesystem)) {
        const fs = disk.filesystem;
        const rowId = `${fs.fstype}-${fs.id}`;
        const isExpanded = expanded?.id === rowId && Boolean(expanded?.content);
        const datastoreActions = [
          {
            children: "Remove datastore...",
            onClick: () => setExpanded({ content: "deleteDisk", id: rowId }),
          },
        ];
        rows.push({
          className: isExpanded ? "p-table__row is-active" : null,
          columns: [
            { content: disk.name },
            { content: "VMFS6" },
            { content: formatSize(disk.size) },
            { content: fs.mount_point },
            {
              content: (
                <TableMenu
                  disabled={!canEditStorage}
                  links={datastoreActions}
                  position="right"
                  title="Take action:"
                />
              ),
              className: "u-align--right",
            },
          ],
          expanded: isExpanded,
          expandedContent: (
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
                        systemId,
                      })
                    );
                  }}
                  onSaveAnalytics={{
                    action: "Delete datastore",
                    category: "Machine storage",
                    label: "Remove datastore",
                  }}
                  statusKey="deletingDisk"
                  systemId={systemId}
                />
              )}
            </div>
          ),
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
          headers={[
            { content: "Name" },
            { content: "Filesystem" },
            { content: "Size" },
            { content: "Mount point" },
            {
              content: "Actions",
              className: "u-align--right",
            },
          ]}
          rows={rows}
        />
      </>
    );
  }
  return null;
};

export default DatastoresTable;
