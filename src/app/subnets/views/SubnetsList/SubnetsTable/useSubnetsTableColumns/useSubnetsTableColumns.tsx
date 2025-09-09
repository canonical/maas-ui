import { useMemo } from "react";

import { GroupRowActions } from "@canonical/maas-react-components";
import type { ColumnDef, Row } from "@tanstack/react-table";
import pluralize from "pluralize";
import { Link } from "react-router";

import type { GroupByKey } from "../types";

import type { Fabric } from "@/app/store/fabric/types";
import { getFabricDisplay } from "@/app/store/fabric/utils";
import type { Space } from "@/app/store/space/types";
import type { Subnet } from "@/app/store/subnet/types";
import type { VLAN } from "@/app/store/vlan/types";
import { getVLANDisplay } from "@/app/store/vlan/utils";
import urls from "@/app/subnets/urls";

export type SubnetsRowData = {
  id: Subnet["id"];
  cidr: Subnet["cidr"];
  name: Subnet["name"];
  vlan: VLAN | undefined;
  dhcpStatus: string | undefined;
  fabric: Fabric | undefined;
  space: Space | null | undefined;
  available_string: Subnet["statistics"]["available_string"];
  groupName: string;
};

export type SubnetsColumnDef = ColumnDef<
  SubnetsRowData,
  Partial<SubnetsRowData>
>;

const useSubnetsTableColumns = (groupBy: GroupByKey): SubnetsColumnDef[] => {
  return useMemo(
    (): SubnetsColumnDef[] => [
      {
        id: "groupName",
        accessorKey: "groupName",
        enableSorting: false,
        cell: ({ row }: { row: Row<SubnetsRowData> }) => {
          return (
            <div>
              <div>
                <strong>
                  {groupBy === "space" && !row.original.space ? (
                    row.original.groupName
                  ) : (
                    <Link
                      to={
                        groupBy === "fabric"
                          ? urls.fabric.index({ id: row.original.fabric!.id })
                          : urls.space.index({ id: row.original.space!.id })
                      }
                    >
                      {row.original.groupName}
                    </Link>
                  )}
                </strong>
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
        accessorKey: "subnet",
        enableSorting: false,
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
        accessorKey: "vlan",
        enableSorting: false,
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
        id: "dhcpStatus",
        accessorKey: "dhcpStatus",
        enableSorting: false,
        header: "DHCP",
      },
      {
        id: "available_ips",
        accessorKey: "available_string",
        enableSorting: false,
        header: "Available IPs",
      },
      {
        id: "fabric",
        accessorKey: "fabric",
        enableSorting: false,
        header: "Fabric",
        cell: ({ row }) =>
          row.getIsGrouped() ? (
            <GroupRowActions row={row} />
          ) : row.original.fabric ? (
            <Link to={urls.fabric.index({ id: row.original.fabric.id })}>
              {getFabricDisplay(row.original.fabric)}
            </Link>
          ) : (
            ""
          ),
      },
      {
        id: "space",
        accessorKey: "space",
        enableSorting: false,
        header: "Space",
        cell: ({ row }) =>
          row.getIsGrouped() ? (
            <GroupRowActions row={row} />
          ) : row.original.space ? (
            <Link to={urls.space.index({ id: row.original.space.id })}>
              {row.original.space.name}
            </Link>
          ) : (
            "No space"
          ),
      },
    ],
    [groupBy]
  );
};

export default useSubnetsTableColumns;
