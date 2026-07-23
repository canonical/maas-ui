import { useMemo } from "react";

import { Button, Icon } from "@canonical/react-components";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router";

import type { SwitchResponse } from "@/app/apiclient";
import DoubleRow from "@/app/base/components/DoubleRow";
import TableActions from "@/app/base/components/TableActions";
// import type { SwitchItem } from "@/app/switches/types";

type SwitchColumnDef = ColumnDef<SwitchResponse>;

const useSwitchesTableColumns = (): SwitchColumnDef[] => {
  return useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        enableSorting: true,
        meta: { isInteractiveHeader: true },
        header: (header) => (
          <>
            <Button
              appearance="link"
              className="p-button--column-header"
              onClick={(e) => {
                e.stopPropagation();
                const sortingFn = header.column.getToggleSortingHandler();
                sortingFn && sortingFn(e);
              }}
              type="button"
            >
              Name
            </Button>
            {{
              asc: <Icon name="chevron-up">ascending</Icon>,
              desc: <Icon name="chevron-down">descending</Icon>,
            }[header.column.getIsSorted() as string] ?? null}
            <br />
            <span>MAC address</span>
          </>
        ),
        cell: ({
          row: {
            original: { name, management_mac, id },
          },
        }) => (
          <DoubleRow
            primary={<Link to={`/switches/${id}/summary`}>{name ?? "—"}</Link>}
            primaryTitle={name}
            secondary={management_mac ?? "—"}
            secondaryTitle={management_mac}
          />
        ),
      },
      // Add when we have the status field in the API response
      // {
      //   id: "status",
      //   accessorKey: "status",
      //   enableSorting: false,
      //   header: "Status",
      //   cell: ({ row }) => <span>{row.original.status ?? "—"}</span>,
      // },
      {
        id: "target_image",
        accessorKey: "target_image",
        enableSorting: false,
        header: "Image",
        cell: ({ row }) => <span>{row.original.target_image ?? "—"}</span>,
      },
      {
        id: "actions",
        accessorKey: "id",
        enableSorting: false,
        header: "Actions",
        cell: () => (
          <TableActions onDelete={() => undefined} onEdit={() => undefined} />
        ),
      },
    ],
    []
  );
};

export default useSwitchesTableColumns;
