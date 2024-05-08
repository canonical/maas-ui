import { DynamicTable, TableCaption } from "@canonical/maas-react-components";
import { Link } from "react-router-dom";

import TableActions from "@/app/base/components/TableActions";
import type { ReservedIp } from "@/app/store/reservedip/types/base";
import { getNodeUrl } from "@/app/store/reservedip/utils";
import { getNodeTypeDisplay } from "@/app/store/utils";

const headers = [
  { content: "IP Address", className: "ip-col", sortKey: "ip_address" },
  { content: "MAC Address", className: "mac-col", sortKey: "mac_address" },
  { content: "Node", className: "node-col", sortKey: "node" },
  {
    content: "Interface",
    className: "interface-col",
    sortKey: "interface",
  },
  { content: "Usage", className: "usage-col", sortKey: "usage" },
  { content: "Comment", className: "comment-col", sortKey: "comment" },
  { content: "Actions", className: "actions-col" },
] as const;

const generateRows = (reservedIps: ReservedIp[]) =>
  reservedIps.map((reservedIp) => {
    return (
      <tr key={reservedIp.mac_address}>
        <td>{reservedIp.ip}</td>
        <td>{reservedIp.mac_address}</td>
        <td>
          {reservedIp?.node_summary ? (
            <Link
              to={getNodeUrl(
                reservedIp.node_summary.node_type,
                reservedIp.node_summary.system_id
              )}
            >
              <strong>{reservedIp.node_summary.hostname}</strong>.
              {reservedIp.node_summary.fqdn.split(".")[1]}
            </Link>
          ) : (
            "—"
          )}
        </td>
        <td>{reservedIp.node_summary?.via || "—"}</td>
        <td>
          {reservedIp.node_summary?.node_type !== undefined
            ? getNodeTypeDisplay(reservedIp.node_summary.node_type)
            : "—"}
        </td>
        <td>{reservedIp.comment || "—"}</td>
        <td>
          <TableActions onDelete={() => {}} onEdit={() => {}} />
        </td>
      </tr>
    );
  });

type Props = {
  reservedIps: ReservedIp[];
  loading: boolean;
};

const StaticDHCPTable = ({ reservedIps, loading }: Props) => {
  return (
    <DynamicTable
      aria-label="Static DHCP leases"
      className="static-dhcp-table u-sv3"
      variant="regular"
    >
      <thead>
        <tr>
          {headers.map((header) => (
            <th className={header.className} key={header.content}>
              {header.content}
            </th>
          ))}
        </tr>
      </thead>
      {loading ? (
        <DynamicTable.Loading />
      ) : reservedIps.length ? (
        <DynamicTable.Body>{generateRows(reservedIps)}</DynamicTable.Body>
      ) : (
        <TableCaption>
          <TableCaption.Title>
            No static DHCP leases available
          </TableCaption.Title>
        </TableCaption>
      )}
    </DynamicTable>
  );
};

export default StaticDHCPTable;
