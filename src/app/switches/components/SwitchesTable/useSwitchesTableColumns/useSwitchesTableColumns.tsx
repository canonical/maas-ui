import { useMemo } from "react";

import { useSidePanel } from "@canonical/maas-react-components";
import { Button, Icon } from "@canonical/react-components";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router";

import type { SwitchResponse } from "@/app/apiclient";
import DoubleRow from "@/app/base/components/DoubleRow";
import TableActions from "@/app/base/components/TableActions";
import { useHasEntitlements } from "@/app/base/hooks";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import DeleteSwitch from "@/app/switches/components/DeleteSwitch";
import EditSwitch from "@/app/switches/components/EditSwitch";

type SwitchColumnDef = ColumnDef<SwitchResponse>;

const useSwitchesTableColumns = (): SwitchColumnDef[] => {
  const { openSidePanel } = useSidePanel();
  const canEdit = useHasEntitlements([Entitlement.CAN_EDIT_GLOBAL_ENTITIES]);
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
        cell: ({
          row: {
            original: { id },
          },
        }) => (
          <TableActions
            deleteDisabled={!canEdit}
            editDisabled={!canEdit}
            onDelete={() => {
              openSidePanel({
                component: DeleteSwitch,
                title: "Delete switch",
                props: { id },
              });
            }}
            onEdit={() => {
              openSidePanel({
                component: EditSwitch,
                title: "Edit switch",
                props: { id },
              });
            }}
          />
        ),
      },
    ],
    [canEdit, openSidePanel]
  );
};

export default useSwitchesTableColumns;
