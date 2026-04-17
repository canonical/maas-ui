import type { ReactElement } from "react";

import { GenericTable } from "@canonical/maas-react-components";

import { useGroupEntitlements } from "@/app/api/query/groups";
import type { UserGroupResponse } from "@/app/apiclient";
import usePagination from "@/app/base/hooks/usePagination/usePagination";
import useGroupEntitlementsTableColumns from "@/app/settings/views/UserManagement/views/Groups/components/GroupEntitlementsTable/useGroupEntitlementsTableColumns/useGroupEntitlementsTableColumns";
import { group } from "@/testing/factories/groups";

type GroupEntitlementsTableProps = {
  id: UserGroupResponse["id"];
};

const GroupEntitlementsTable = ({
  id,
}: GroupEntitlementsTableProps): ReactElement => {
  const { page, size, handlePageSizeChange, setPage } = usePagination();

  const columns = useGroupEntitlementsTableColumns({ group_id: id });

  const { data, isPending } = useGroupEntitlements({
    path: { group_id: id! },
  });

  const entitlements = data?.items.map((entitlement) => ({
    ...entitlement,
    id: `${entitlement.entitlement}-${entitlement.resource_id}`,
  }));

  return (
    <GenericTable
      aria-label={`${group?.name || "Group"} entitlements`}
      className="groups-entitlements-table"
      columns={columns}
      data={entitlements ?? []}
      isLoading={isPending}
      noData="No group entitlements found."
      pagination={{
        currentPage: page,
        dataContext: "entitlements",
        handlePageSizeChange: handlePageSizeChange,
        isPending: isPending,
        itemsPerPage: size,
        setCurrentPage: setPage,
        totalItems: entitlements?.total ?? 0,
      }}
    />
  );
};
export default GroupEntitlementsTable;
