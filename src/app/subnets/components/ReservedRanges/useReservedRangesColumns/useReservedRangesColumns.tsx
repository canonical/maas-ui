import { useMemo } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import { Labels } from "../ReservedRanges";

import SubnetLink from "@/app/base/components/SubnetLink";
import TableActions from "@/app/base/components/TableActions";
import type { SetSidePanelContent } from "@/app/base/side-panel-context";
import {
  SubnetActionTypes,
  SubnetDetailsSidePanelViews,
} from "@/app/subnets/views/SubnetDetails/constants";

export type ReservedRangesTableData = {
  id: number | string;
  ipRangeId?: number;
  subnet: number | null;
  startIp: string;
  endIp: string;
  owner: string;
  type: string;
  comment: string;
};

export type ReservedRangesColumnsDef = ColumnDef<
  ReservedRangesTableData,
  Partial<ReservedRangesTableData>
>;

const useReservedRangesColumns = (
  showSubnetColumn: boolean,
  setSidePanelContent: SetSidePanelContent
): ReservedRangesColumnsDef[] => {
  return useMemo((): ReservedRangesColumnsDef[] => {
    const columns: ReservedRangesColumnsDef[] = [
      {
        accessorKey: "startIp",
        header: Labels.StartIP,
      },
      {
        accessorKey: "endIp",
        header: Labels.EndIP,
      },
      {
        accessorKey: "owner",
        header: Labels.Owner,
      },
      {
        accessorKey: "type",
        header: Labels.Type,
      },
      {
        accessorKey: "comment",
        header: Labels.Comment,
      },
      {
        accessorKey: "actions",
        header: Labels.Actions,
        enableSorting: false,
        cell: ({
          row: {
            original: { ipRangeId },
          },
        }) => (
          <TableActions
            onDelete={() => {
              setSidePanelContent({
                view: SubnetDetailsSidePanelViews[
                  SubnetActionTypes.DeleteReservedRange
                ],
                extras: {
                  ipRangeId: ipRangeId,
                },
              });
            }}
            onEdit={() => {
              setSidePanelContent({
                view: SubnetDetailsSidePanelViews[
                  SubnetActionTypes.ReserveRange
                ],
                extras: {
                  ipRangeId: ipRangeId,
                },
              });
            }}
          />
        ),
      },
    ];

    // When viewing a VLAN, include Subnet as the first column
    if (showSubnetColumn) {
      columns.unshift({
        accessorKey: "subnet",
        header: Labels.Subnet,
        cell: ({
          row: {
            original: { subnet },
          },
        }) => <SubnetLink id={subnet} />,
      });
    }
    return columns;
  }, [setSidePanelContent, showSubnetColumn]);
};

export default useReservedRangesColumns;
