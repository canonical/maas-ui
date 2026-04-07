import { useMemo } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import ScriptStatus from "../../../ScriptStatus";

import type { ScriptResult } from "@/app/store/scriptresult/types";

type NodeTestDetailsColumnData = ScriptResult & {
  id: number;
};

export type NodeTestDetailsColumnDef = ColumnDef<
  NodeTestDetailsColumnData,
  Partial<NodeTestDetailsColumnData>
>;

const useNodeTestDetailsTableColumns = (): NodeTestDetailsColumnDef[] => {
  return useMemo(
    (): NodeTestDetailsColumnDef[] => [
      {
        accessorKey: "status",
        enableSorting: false,
        id: "status",
        cell: ({
          row: {
            original: { status, status_name },
          },
        }) => <ScriptStatus status={status}>{status_name}</ScriptStatus>,
      },
      {
        accessorKey: "exit_status",
        enableSorting: false,
        id: "exit_status",
        header: "Exit status",
      },
      {
        accessorKey: "tags",
        enableSorting: false,
        id: "tags",
      },
      {
        accessorKey: "started",
        enableSorting: false,
        id: "started",
        header: "Start time",
      },
      {
        accessorKey: "ended",
        enableSorting: false,
        id: "ended",
        header: "End time",
      },
      {
        accessorKey: "runtime",
        enableSorting: false,
        id: "runtime",
      },
    ],
    []
  );
};

export default useNodeTestDetailsTableColumns;
