import { useMemo } from "react";

import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router";

import type { FabricResponse } from "@/app/apiclient";
import TableActions from "@/app/base/components/TableActions";
import { useHasEntitlements } from "@/app/base/hooks";
import { useModal } from "@/app/base/modal-context";
import urls from "@/app/networks/urls";
import { DeleteFabric } from "@/app/networks/views/Fabrics/components";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";

type FabricsColumnDef = ColumnDef<FabricResponse, Partial<FabricResponse>>;

const useFabricsTableColumns = (): FabricsColumnDef[] => {
  const { openModal } = useModal();
  const canEdit = useHasEntitlements([Entitlement.CAN_EDIT_GLOBAL_ENTITIES]);
  return useMemo<FabricsColumnDef[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        enableSorting: true,
        cell: ({
          row: {
            original: { id, name },
          },
        }) => <Link to={urls.fabric.index({ id })}>{name}</Link>,
      },
      {
        id: "description",
        accessorKey: "description",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({
          row: {
            original: { id },
          },
        }) => (
          <TableActions
            deleteDisabled={!canEdit}
            onDelete={() => {
              openModal({
                component: DeleteFabric,
                title: "Delete fabric",
                props: { id },
              });
            }}
          />
        ),
      },
    ],
    [canEdit, openModal]
  );
};

export default useFabricsTableColumns;
