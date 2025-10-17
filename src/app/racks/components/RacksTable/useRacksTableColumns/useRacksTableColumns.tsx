import { useMemo } from "react";

import type { ColumnDef, Row } from "@tanstack/react-table";
import pluralize from "pluralize";
import { Link } from "react-router";

import type { RackResponse } from "@/app/apiclient";
import TableActionsDropdown from "@/app/base/components/TableActionsDropdown";
import urls from "@/app/base/urls";
import { FilterControllers } from "@/app/store/controller/utils";

type RackWithSummaryResponse = RackResponse & { registered: string[] };

type RacksColumnDef = ColumnDef<RackWithSummaryResponse>;

enum RackActions {
  Edit = "editRack",
  Delete = "deleteRack",
  RegisterController = "registerController",
  RemoveControllers = "removeControllers",
}

const actions = [
  { label: "Edit rack...", type: RackActions.Edit },
  { label: "Delete rack...", type: RackActions.Delete },
  { label: "Register controller...", type: RackActions.RegisterController },
  { label: "Remove controllers...", type: RackActions.RemoveControllers },
];

const getControllersLabel = (row: Row<RackWithSummaryResponse>) => {
  if (row.original.registered.length === 0) {
    return "0 controllers";
  }
  const filters = FilterControllers.filtersToQueryString({
    system_id: [`=${row.original.registered.join(",")}`],
  });
  return (
    <Link to={`${urls.controllers.index}${filters}`}>
      {`${row.original.registered.length} ${pluralize("controller", row.original.registered.length)}`}
    </Link>
  );
};

const useRacksTableColumns = (): RacksColumnDef[] => {
  return useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        enableSorting: true,
        header: "Name",
      },
      {
        id: "registered",
        accessorKey: "registered",
        enableSorting: true,
        header: "Registered",
        cell: ({ row }) => {
          return getControllersLabel(row);
        },
      },
      {
        id: "actions",
        accessorKey: "id",
        enableSorting: false,
        header: "Actions",
        cell: () => {
          return (
            <TableActionsDropdown
              actions={actions}
              onActionClick={(action: RackActions) => {
                switch (action) {
                  case RackActions.Edit:
                    // openSidePanel(<EditRack rack={row.original} />);
                    break;
                  case RackActions.Delete:
                    // openSidePanel(<DeleteRack rack={row.original} />);
                    break;
                  case RackActions.RegisterController:
                    // openSidePanel(<RegisterController rack={row.original} />);
                    break;
                  case RackActions.RemoveControllers:
                    // openSidePanel(<RemoveControllers rack={row.original} />);
                    break;
                  default:
                    break;
                }
              }}
            />
          );
        },
      },
    ],
    []
  );
};

export default useRacksTableColumns;
