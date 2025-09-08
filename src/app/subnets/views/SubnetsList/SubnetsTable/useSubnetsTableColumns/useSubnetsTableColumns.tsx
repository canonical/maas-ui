import { useMemo } from "react";

import type { ColumnDef, Row } from "@tanstack/react-table";
import pluralize from "pluralize";
import { Link } from "react-router";

import type { Fabric } from "@/app/store/fabric/types";
import { getFabricDisplay } from "@/app/store/fabric/utils";
import type { Space } from "@/app/store/space/types";
import type { Subnet } from "@/app/store/subnet/types";
import type { VLAN } from "@/app/store/vlan/types";
import { getVLANDisplay } from "@/app/store/vlan/utils";
import urls from "@/app/subnets/urls";

// id, cidr, name, vlan, fabric, space, available_string
export type SubnetsRowData = {
  id: Subnet["id"];
  cidr: Subnet["cidr"];
  name: Subnet["name"];
  vlan: VLAN | undefined;
  fabric: Fabric | undefined;
  space: Space | null | undefined;
  available_string: Subnet["statistics"]["available_string"];
  groupName: string;
};

export type SubnetsColumnDef = ColumnDef<
  SubnetsRowData,
  Partial<SubnetsRowData>
>;

const useSubnetsTableColumns = (): SubnetsColumnDef[] => {
  return useMemo(
    (): SubnetsColumnDef[] => [
      {
        id: "groupName",
        accessorKey: "groupName",
        cell: ({ row }: { row: Row<SubnetsRowData> }) => {
          return (
            <div className="u-align-text--left">
              <div>
                <strong>{row.original.groupName}</strong>
              </div>
              <small className="u-text--muted">
                {pluralize("subnets", row.getLeafRows().length ?? 0, true)}
              </small>
            </div>
          );
        },
      },
      {
        id: "subnet",
        accessorKey: "cidr",
        header: "Subnet",
        cell: ({ row: { original: subnet } }) => (
          <Link to={urls.subnet.index({ id: subnet.id })}>
            {subnet.name !== subnet.cidr
              ? `${subnet.cidr} (${subnet.name})`
              : subnet.cidr}
          </Link>
        ),
      },
      {
        id: "vlan",
        accessorKey: "vlan.vid",
        header: "VLAN",
        cell: ({
          row: {
            original: { vlan },
          },
        }) => (
          // subnet will always have a vlan, we just assert it here since Array.find can return undefined
          <Link to={urls.vlan.index({ id: vlan!.id })}>
            {getVLANDisplay(vlan)}
          </Link>
        ),
      },
      {
        id: "dchp",
        accessorKey: "vlan.dhcp_on",
        header: "DHCP",
        cell: ({
          row: {
            original: { vlan },
          },
        }) => <></>,
      },
      {
        id: "available_ips",
        accessorKey: "available_string",
        header: "Available IPs",
      },
      {
        id: "fabric",
        accessorKey: "fabric",
        header: "Fabric",
        cell: ({
          row: {
            original: { fabric },
          },
        }) =>
          fabric ? (
            <Link to={urls.fabric.index({ id: fabric.id })}>
              {getFabricDisplay(fabric)}
            </Link>
          ) : (
            ""
          ),
      },
      {
        id: "space",
        accessorKey: "space.name",
        header: "Space",
        cell: ({
          row: {
            original: { space },
          },
        }) =>
          space ? (
            <Link to={urls.space.index({ id: space.id })}>{space.name}</Link>
          ) : (
            "No space"
          ),
      },
    ],
    []
  );
};

export default useSubnetsTableColumns;
