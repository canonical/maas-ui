import { useMemo } from "react";

import type { ColumnDef, Row } from "@tanstack/react-table";

import { CacheSetAction } from "../CacheSetsTable";

import TableActionsDropdown from "@/app/base/components/TableActionsDropdown";
import { useSidePanel } from "@/app/base/side-panel-context";
import { MachineSidePanelViews } from "@/app/machines/constants";
import type { Disk, Node } from "@/app/store/types/node";
import { formatSize } from "@/app/store/utils";

export type CacheSetsColumnDef = ColumnDef<Disk, Partial<Disk>>;

type Props = {
  isMachine: boolean;
  canEditStorage: boolean;
  systemId: Node["system_id"];
};

const useCacheSetsColumns = ({
  isMachine,
  canEditStorage,
  systemId,
}: Props): CacheSetsColumnDef[] => {
  const { setSidePanelContent } = useSidePanel();

  return useMemo<CacheSetsColumnDef[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        enableSorting: false,
      },
      {
        id: "size",
        accessorKey: "size",
        enableSorting: false,
        cell: ({ row: { original: disk } }) => formatSize(disk.size),
      },
      {
        id: "used_for",
        accessorKey: "used_for",
        enableSorting: false,
        header: "Used for",
      },
      ...(isMachine
        ? [
            {
              id: "actions",
              accessorKey: "actions",
              enableSorting: false,
              cell: ({ row: { original: disk } }: { row: Row<Disk> }) => (
                <TableActionsDropdown
                  actions={[
                    {
                      label: "Remove cache set...",
                      type: CacheSetAction.DELETE,
                    },
                  ]}
                  disabled={!canEditStorage}
                  onActionClick={(action: CacheSetAction) => {
                    if (action === CacheSetAction.DELETE) {
                      setSidePanelContent({
                        view: MachineSidePanelViews.DELETE_CACHE_SET,
                        extras: { systemId, disk },
                      });
                    }
                  }}
                />
              ),
            },
          ]
        : []),
    ],
    [canEditStorage, isMachine, setSidePanelContent, systemId]
  );
};

export default useCacheSetsColumns;
