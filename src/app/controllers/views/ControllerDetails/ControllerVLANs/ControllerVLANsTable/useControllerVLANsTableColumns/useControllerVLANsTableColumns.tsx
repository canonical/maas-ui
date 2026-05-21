import { useMemo } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import ControllerLink from "@/app/base/components/ControllerLink";
import FabricLink from "@/app/base/components/FabricLink";
import SubnetLink from "@/app/base/components/SubnetLink";
import VLANLink from "@/app/base/components/VLANLink";
import type { ControllerTableData } from "@/app/controllers/views/ControllerDetails/ControllerVLANs/ControllerVLANsTable/types";
import type { Subnet } from "@/app/store/subnet/types";

type ControllerVLANsColumnDef = ColumnDef<
  ControllerTableData,
  Partial<ControllerTableData>
>;

const useControllerVLANsTableColumns = (): ControllerVLANsColumnDef[] => {
  return useMemo(
    () => [
      {
        id: "fabric",
        header: "Fabric",
        accessorKey: "fabric_id",
        enableSorting: true,
        cell: ({
          row: {
            original: { fabric_id },
          },
        }) => <FabricLink id={fabric_id} />,
      },
      {
        id: "vlan",
        header: "VLAN",
        accessorKey: "vlan_id",
        enableSorting: false,
        cell: ({
          row: {
            original: { vlan_id },
          },
        }) => <VLANLink id={vlan_id} />,
      },
      {
        id: "dhcp",
        header: "DHCP",
        accessorKey: "dhcp",
        enableSorting: false,
      },
      {
        id: "subnets",
        header: "Subnets",
        accessorKey: "subnets",
        enableSorting: false,
        cell: ({
          row: {
            original: { subnet },
          },
        }) => (
          <>
            {subnet?.map(({ id }: Subnet) => (
              <div key={id}>
                <SubnetLink id={id} />
              </div>
            ))}
          </>
        ),
      },
      {
        id: "primary_rack",
        header: "Primary rack",
        accessorKey: "primary_rack",
        enableSorting: false,
        cell: ({
          row: {
            original: { primary_rack },
          },
        }) => <ControllerLink systemId={primary_rack} />,
      },
      {
        id: "secondary_rack",
        header: "Secondary rack",
        accessorKey: "secondary_rack",
        enableSorting: false,
        cell: ({
          row: {
            original: { secondary_rack },
          },
        }) => <ControllerLink systemId={secondary_rack} />,
      },
    ],
    []
  );
};

export default useControllerVLANsTableColumns;
