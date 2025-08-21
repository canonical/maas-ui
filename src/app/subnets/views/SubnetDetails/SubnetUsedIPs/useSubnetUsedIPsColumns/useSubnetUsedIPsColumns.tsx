import { useMemo } from "react";

import type { ColumnDef, Row } from "@tanstack/react-table";

import NodeLink from "@/app/base/components/node/NodeLink";
import type { SubnetIP } from "@/app/store/subnet/types";
import { getIPTypeDisplay, getIPUsageDisplay } from "@/app/store/subnet/utils";
import type { SubnetUsedIP } from "@/app/subnets/views/SubnetDetails/SubnetUsedIPs/SubnetUsedIPs";

export type SubnetIPColumnDef = ColumnDef<SubnetUsedIP, Partial<SubnetUsedIP>>;

const useSubnetUsedIPsColumns = (): SubnetIPColumnDef[] => {
  return useMemo(
    () => [
      {
        id: "ip",
        accessorKey: "ip",
        enableSorting: true,
        header: "IP Address",
      },
      {
        id: "type",
        accessorKey: "type",
        enableSorting: true,
        header: "Type",
        cell: ({
          row: {
            original: { alloc_type },
          },
        }: {
          row: Row<SubnetIP>;
        }) => getIPTypeDisplay(alloc_type),
      },
      {
        id: "node",
        accessorKey: "node",
        enableSorting: true,
        header: "Node",
        cell: ({
          row: {
            original: { node_summary },
          },
        }: {
          row: Row<SubnetIP>;
        }) =>
          node_summary ? (
            <NodeLink
              nodeType={node_summary.node_type}
              systemId={node_summary.system_id}
            />
          ) : (
            "—"
          ),
      },
      {
        id: "interface",
        accessorKey: "interface",
        enableSorting: true,
        header: "Interface",
        cell: ({
          row: {
            original: { node_summary },
          },
        }: {
          row: Row<SubnetIP>;
        }) => node_summary?.via || "—",
      },
      {
        id: "usage",
        accessorKey: "usage",
        enableSorting: true,
        header: "Usage",
        cell: ({ row: { original } }: { row: Row<SubnetIP> }) =>
          getIPUsageDisplay(original),
      },
      {
        id: "owner",
        accessorKey: "owner",
        enableSorting: true,
        header: "Owner",
        cell: ({
          row: {
            original: { user },
          },
        }: {
          row: Row<SubnetIP>;
        }) => user || "—",
      },
      {
        id: "updated",
        accessorKey: "updated",
        enableSorting: false,
        header: "Last Seen",
      },
    ],
    []
  );
};

export default useSubnetUsedIPsColumns;
