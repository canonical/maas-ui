import { useState } from "react";

import { MainTable } from "@canonical/react-components";
import type { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";
import { useDispatch } from "react-redux";

import TableActionsDropdown from "app/base/components/TableActionsDropdown";
import ActionConfirm from "app/base/components/node/ActionConfirm";
import type { ControllerDetails } from "app/store/controller/types";
import { actions as machineActions } from "app/store/machine";
import type { MachineDetails } from "app/store/machine/types";
import { formatSize, isCacheSet, nodeIsMachine } from "app/store/utils";

export enum CacheSetAction {
  DELETE = "deleteCacheSet",
}

type Expanded = {
  content: CacheSetAction;
  id: string;
};

type Props = {
  canEditStorage: boolean;
  node: ControllerDetails | MachineDetails;
};

const CacheSetsTable = ({ canEditStorage, node }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState<Expanded | null>(null);
  const closeExpanded = () => setExpanded(null);
  const isMachine = nodeIsMachine(node);

  const headers = [
    { content: "Name" },
    { content: "Size" },
    { content: "Used for" },
    {
      className: "u-align--right",
      content: "Actions",
    },
  ];

  const rows = node.disks.reduce<MainTableRow[]>((rows, disk) => {
    if (isCacheSet(disk)) {
      const rowId = `${disk.type}-${disk.id}`;
      const isExpanded = expanded?.id === rowId && Boolean(expanded?.content);

      rows.push({
        className: isExpanded ? "p-table__row is-active" : null,
        columns: [
          { content: disk.name },
          { content: formatSize(disk.size) },
          { className: "u-break-spaces", content: disk.used_for },
          ...(isMachine
            ? [
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
              ]
            : []),
        ].map((column, i) => ({
          ...column,
          "aria-label": headers[i].content,
        })),
        expanded: isExpanded,
        expandedContent: isMachine ? (
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
                      systemId: node.system_id,
                    })
                  );
                }}
                onSaveAnalytics={{
                  action: "Delete cache set",
                  category: "Machine storage",
                  label: "Remove cache set",
                }}
                statusKey="deletingCacheSet"
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
    <MainTable
      className="p-table-expanding--light"
      expanding
      responsive
      headers={isMachine ? headers : headers.slice(0, -1)}
      rows={rows}
    />
  );
};

export default CacheSetsTable;
