import type { ReactElement } from "react";

import { GenericTable } from "@canonical/maas-react-components";

import { useGroupMembers } from "@/app/api/query/groups";
import type { UserGroupResponse } from "@/app/apiclient";
import usePagination from "@/app/base/hooks/usePagination/usePagination";
import useGroupMembersTableColumns from "@/app/settings/views/UserManagement/views/Groups/components/GroupMembersTable/useGroupMembersTableColumns/useGroupMembersTableColumns";
import { group } from "@/testing/factories/groups";

type GroupMembersTableProps = {
  id: UserGroupResponse["id"];
};

const GroupMembersTable = ({ id }: GroupMembersTableProps): ReactElement => {
  const { page, size, handlePageSizeChange, setPage } = usePagination();

  const columns = useGroupMembersTableColumns({ group_id: id });

  const { data, isPending } = useGroupMembers({
    path: { group_id: id! },
  });

  const members = data?.items.map((member) => ({
    ...member,
    id: member.user_id.toString(),
  }));

  return (
    <GenericTable
      aria-label={`${group?.name || "Group"} members`}
      className="groups-members-table"
      columns={columns}
      data={members ?? []}
      isLoading={isPending}
      noData="No group members found."
      pagination={{
        currentPage: page,
        dataContext: "members",
        handlePageSizeChange: handlePageSizeChange,
        isPending: isPending,
        itemsPerPage: size,
        setCurrentPage: setPage,
        totalItems: members?.total ?? 0,
      }}
    />
  );
};
export default GroupMembersTable;
