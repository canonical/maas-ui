import { useState } from "react";

import { MainTable } from "@canonical/react-components";
import type { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";
import { useDispatch, useSelector } from "react-redux";

import TableActionsDropdown from "app/base/components/TableActionsDropdown";
import ActionConfirm from "app/base/components/node/ActionConfirm";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import { isMachineDetails } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { formatSize, isCacheSet } from "app/store/utils";

export enum CacheSetAction {
  DELETE = "deleteCacheSet",
}

type Expanded = {
  content: CacheSetAction;
  id: string;
};

type Props = {
  canEditStorage: boolean;
  systemId: Machine["system_id"];
};

const CacheSetsTable = ({
  canEditStorage,
  systemId,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const [expanded, setExpanded] = useState<Expanded | null>(null);
  const closeExpanded = () => setExpanded(null);

  const headers = [
    { content: "Name" },
    { content: "Size" },
    { content: "Used for" },
    {
      className: "u-align--right",
      content: "Actions",
    },
  ];

  if (isMachineDetails(machine)) {
    const rows = machine.disks.reduce<MainTableRow[]>((rows, disk) => {
      if (isCacheSet(disk)) {
        const rowId = `${disk.type}-${disk.id}`;
        const isExpanded = expanded?.id === rowId && Boolean(expanded?.content);

        rows.push({
          className: isExpanded ? "p-table__row is-active" : null,
          columns: [
            { content: disk.name },
            { content: formatSize(disk.size) },
            { className: "u-break-spaces", content: disk.used_for },
            {
              className: "u-align--right",
              content: (
                <TableActionsDropdown
                  actions={[
                    {
                      label: "Remove cache set...",
                      type: CacheSetAction.DELETE,
                    },
                  ]}
                  disabled={!canEditStorage}
                  onActionClick={(action: CacheSetAction) =>
                    setExpanded({ content: action, id: rowId })
                  }
                />
              ),
            },
          ].map((column, i) => ({
            ...column,
            "aria-label": headers[i].content,
          })),
          expanded: isExpanded,
          expandedContent: (
            <div className="u-flex--grow">
              {expanded?.content === CacheSetAction.DELETE && (
                <ActionConfirm
                  closeExpanded={closeExpanded}
                  confirmLabel="Remove cache set"
                  eventName="deleteCacheSet"
                  message="Are you sure you want to remove this cache set?"
                  onConfirm={() => {
                    dispatch(machineActions.cleanup());
                    dispatch(
                      machineActions.deleteCacheSet({
                        cacheSetId: disk.id,
                        systemId,
                      })
                    );
                  }}
                  onSaveAnalytics={{
                    action: "Delete cache set",
                    category: "Machine storage",
                    label: "Remove cache set",
                  }}
                  statusKey="deletingCacheSet"
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
      <MainTable
        className="p-table-expanding--light"
        expanding
        responsive
        headers={headers}
        rows={rows}
      />
    );
  }
  return null;
};

export default CacheSetsTable;
