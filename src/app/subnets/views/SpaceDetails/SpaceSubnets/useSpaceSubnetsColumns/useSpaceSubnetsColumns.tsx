import { useMemo } from "react";

import type { ColumnDef, Row } from "@tanstack/react-table";

import FabricLink from "@/app/base/components/FabricLink";
import SubnetLink from "@/app/base/components/SubnetLink";
import VLANLink from "@/app/base/components/VLANLink";
import type { SpaceSubnet } from "@/app/subnets/views/SpaceDetails/SpaceSubnets/SpaceSubnets";

export type SubnetColumnDef = ColumnDef<SpaceSubnet, Partial<SpaceSubnet>>;

const useSpaceSubnetsColumns = (): SubnetColumnDef[] => {
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
          row: Row<SpaceSubnet>;
        }) => <SubnetLink id={id} />,
      },
      {
        id: "available_ips",
        accessorKey: "available_ips",
        enableSorting: true,
        header: "Available IPs",
        cell: ({
          row: {
            original: { available_ips },
          },
        }: {
          row: Row<SpaceSubnet>;
        }) => `${available_ips}%`,
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
        }: {
          row: Row<SpaceSubnet>;
        }) => <VLANLink id={vlan} />,
      },
      {
        id: "fabric",
        accessorKey: "fabric",
        enableSorting: false,
        header: "Fabric",
        cell: ({
          row: {
            original: { fabric },
          },
        }: {
          row: Row<SpaceSubnet>;
        }) => {
          return <FabricLink id={fabric} />;
        },
      },
    ],
    []
  );
};

export default useSpaceSubnetsColumns;
