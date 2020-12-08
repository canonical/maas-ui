import { useState } from "react";

import { MainTable } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import ActionConfirm from "../ActionConfirm";
import { formatSize, isCacheSet } from "../utils";

import TableMenu from "app/base/components/TableMenu";
import type { TSFixMe } from "app/base/types";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type Expanded = {
  content: "deleteCacheSet";
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

  if (machine && "disks" in machine) {
    const rows = machine.disks.reduce<TSFixMe[]>((rows, disk) => {
      if (isCacheSet(disk)) {
        const rowId = `${disk.type}-${disk.id}`;
        const isExpanded = expanded?.id === rowId && Boolean(expanded?.content);
        const cacheSetActions = [
          {
            children: "Remove cache set...",
            onClick: () =>
              setExpanded({ content: "deleteCacheSet", id: rowId }),
          },
        ];

        rows.push({
          className: isExpanded ? "p-table__row is-active" : null,
          columns: [
            { content: disk.name },
            { content: formatSize(disk.size) },
            { content: disk.used_for },
            {
              className: "u-align--right",
              content: (
                <TableMenu
                  disabled={!canEditStorage}
                  links={cacheSetActions}
                  position="right"
                  title="Take action:"
                />
              ),
            },
          ],
          expanded: isExpanded,
          expandedContent: (
            <div className="u-flex--grow">
              {expanded?.content === "deleteCacheSet" && (
                <ActionConfirm
                  closeExpanded={closeExpanded}
                  confirmLabel="Remove cache set"
                  message="Are you sure you want to remove this cache set?"
                  onConfirm={() => {
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
        headers={[
          { content: "Name" },
          { content: "Size" },
          { content: "Used for" },
          {
            className: "u-align--right",
            content: "Actions",
          },
        ]}
        rows={rows}
      />
    );
  }
  return null;
};

export default CacheSetsTable;
