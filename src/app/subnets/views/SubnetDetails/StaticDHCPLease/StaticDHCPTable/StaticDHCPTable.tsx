import { DynamicTable, TableCaption } from "@canonical/maas-react-components";
import { Link } from "react-router-dom";

import TableActions from "@/app/base/components/TableActions";
import type { StaticDHCPLease } from "@/app/store/reservedip/types/base";

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
  { content: "Owner", className: "oner-col", sortKey: "owner" },
  { content: "Comment", className: "comment-col", sortKey: "comment" },
  { content: "Actions", className: "actions-col" },
] as const;

const generateRows = (dhcpLeases: StaticDHCPLease[]) =>
  dhcpLeases.map((dhcpLease) => {
    return (
      <tr key={dhcpLease.mac_address}>
        <td>{dhcpLease.ip_address}</td>
        <td>{dhcpLease.mac_address}</td>
        <td>
          {dhcpLease?.node ? (
            <Link to="#">
              <strong>{dhcpLease.node.hostname}</strong>.
              {dhcpLease.node.fqdn.split(".")[1]}
            </Link>
          ) : (
            "—"
          )}
        </td>
        <td>{dhcpLease.interface}</td>
        <td>{dhcpLease.usage || "—"}</td>
        <td>{dhcpLease.owner}</td>
        <td>{dhcpLease.comment || "—"}</td>
        <td>
          <TableActions onDelete={() => {}} onEdit={() => {}} />
        </td>
      </tr>
    );
  });

type Props = {
  staticDHCPLeases: StaticDHCPLease[];
};

const StaticDHCPTable = ({ staticDHCPLeases }: Props) => {
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
      {staticDHCPLeases.length ? (
        <DynamicTable.Body>{generateRows(staticDHCPLeases)}</DynamicTable.Body>
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
