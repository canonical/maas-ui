import { useMemo } from "react";

import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router";

import { SubnetDetailsSidePanelViews } from "../../../constants";

import TableActions from "@/app/base/components/TableActions";
import { useSidePanel } from "@/app/base/side-panel-context";
import type { ReservedIpNodeSummary } from "@/app/store/reservedip/types/base";
import { getNodeUrl } from "@/app/store/reservedip/utils";
import type { NodeType } from "@/app/store/types/node";
import { getNodeTypeDisplay } from "@/app/store/utils";

export type StaticDHCPTableData = {
  id: number;
  macAddress: string;
  ipAddress: string;
  nodeSummary?: ReservedIpNodeSummary;
  via?: string;
  nodeType?: NodeType;
  comment?: string;
};

export type StaticDHCPColunDef = ColumnDef<
  StaticDHCPTableData,
  Partial<StaticDHCPTableData>
>;

const useStaticDHCPTableColumns = (): StaticDHCPColunDef[] => {
  const { setSidePanelContent } = useSidePanel();
  return useMemo(
    (): StaticDHCPColunDef[] => [
      {
        accessorKey: "ip_address",
        header: () => <span className="ip-col">IP Address</span>,
        enableSorting: false,
        cell: ({
          row: {
            original: { ipAddress },
          },
        }) => ipAddress,
      },
      {
        accessorKey: "mac_address",
        header: () => <span className="mac-col">MAC Address</span>,
        enableSorting: false,
        cell: ({
          row: {
            original: { macAddress },
          },
        }) => macAddress || "—",
      },
      {
        accessorKey: "node",
        header: () => <span className="node-col">Node</span>,
        enableSorting: false,
        cell: ({
          row: {
            original: { nodeSummary },
          },
        }) =>
          nodeSummary ? (
            <Link to={getNodeUrl(nodeSummary.node_type, nodeSummary.system_id)}>
              <strong>{nodeSummary.hostname}</strong>.
              {nodeSummary.fqdn.split(".")[1]}
            </Link>
          ) : (
            "—"
          ),
      },
      {
        accessorKey: "interface",
        header: () => <span className="interface-col">Interface</span>,
        enableSorting: false,
        cell: ({
          row: {
            original: { nodeSummary },
          },
        }) => nodeSummary?.via || "—",
      },
      {
        accessorKey: "usage",
        header: () => <span className="usage-col">Usage</span>,
        enableSorting: false,
        cell: ({
          row: {
            original: { nodeSummary },
          },
        }) =>
          nodeSummary?.node_type !== undefined
            ? getNodeTypeDisplay(nodeSummary.node_type)
            : "—",
      },
      {
        accessorKey: "comment",
        header: () => <span className="comment-col">Comment</span>,
        enableSorting: false,
        cell: ({
          row: {
            original: { comment },
          },
        }) => comment || "—",
      },
      {
        accessorKey: "actions",
        header: () => <span className="actions-col">Actions</span>,
        cell: ({
          row: {
            original: { id },
          },
        }) => (
          <TableActions
            onDelete={() => {
              setSidePanelContent({
                view: SubnetDetailsSidePanelViews.DeleteDHCPLease,
                extras: { reservedIpId: id },
              });
            }}
            onEdit={() => {
              setSidePanelContent({
                view: SubnetDetailsSidePanelViews.ReserveDHCPLease,
                extras: { reservedIpId: id },
              });
            }}
          />
        ),
      },
    ],
    [setSidePanelContent]
  );
};

export default useStaticDHCPTableColumns;
