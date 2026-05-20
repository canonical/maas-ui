import { useMemo } from "react";

import type { ColumnDef } from "@tanstack/react-table";
import pluralize from "pluralize";

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
        accessorKey: "fabric",
        enableSorting: false,
        cell: ({ row }) => {
          return (
            <div>
              <div>
                <strong>
                  <FabricLink id={row.original.fabric?.id} />
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
        id: "vlan",
        header: "VLAN",
        accessorKey: "vlan",
        enableSorting: true,
        cell: ({
          row: {
            original: { vlan },
          },
        }) => <VLANLink id={vlan?.id} />,
      },
      {
        id: "dhcp",
        header: "DHCP",
        accessorKey: "dhcp",
        enableSorting: true,
      },
      {
        id: "subnets",
        header: "Subnets",
        accessorKey: "subnets",
        enableSorting: true,
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
        enableSorting: true,
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
        enableSorting: true,
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
