import { useMemo } from "react";

import type { ColumnDef, Row } from "@tanstack/react-table";

import FabricLink from "@/app/base/components/FabricLink";
import SubnetLink from "@/app/base/components/SubnetLink";
import VLANLink from "@/app/base/components/VLANLink";
import type { Subnet } from "@/app/store/subnet/types";
import type { VLAN } from "@/app/store/vlan/types";
import { getVlanById } from "@/app/store/vlan/utils";

export type SubnetColumnDef = ColumnDef<Subnet, Partial<Subnet>>;

const useSpaceSubnetsColumns = (vlans: VLAN[]): SubnetColumnDef[] => {
  return useMemo(
    () => [
      {
        id: "id",
        accessorKey: "id",
        enableSorting: true,
        header: "Subnet",
        cell: ({
          row: {
            original: { id },
          },
        }: {
          row: Row<Subnet>;
        }) => <SubnetLink id={id} />,
      },
      {
        id: "available_ips",
        accessorKey: "available_ips",
        enableSorting: true,
        header: "Available IPs",
        cell: ({
          row: {
            original: {
              statistics: { available_string },
            },
          },
        }: {
          row: Row<Subnet>;
        }) => available_string,
      },
      {
        id: "vlan",
        accessorKey: "vlan",
        enableSorting: true,
        header: "VLAN",
        cell: ({
          row: {
            original: { vlan },
          },
        }: {
          row: Row<Subnet>;
        }) => <VLANLink id={vlan} />,
      },
      {
        id: "fabric",
        accessorKey: "fabric",
        enableSorting: true,
        header: "Fabric",
        cell: ({
          row: {
            original: { vlan },
          },
        }: {
          row: Row<Subnet>;
        }) => {
          return <FabricLink id={getVlanById(vlans, vlan)?.fabric} />;
        },
      },
    ],
    [vlans]
  );
};

export default useSpaceSubnetsColumns;
