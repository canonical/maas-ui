import { useState } from "react";

import { GenericTable, MainToolbar } from "@canonical/maas-react-components";
import { Button } from "@canonical/react-components";

import { Entitlement } from "../../../Groups/constants";

import useUsersTableColumns from "./useUsersTableColumns/useUsersTableColumns";

import { useUsers } from "@/app/api/query/users";
import SearchBox from "@/app/base/components/SearchBox";
import { useHasEntitlements } from "@/app/base/hooks";
import usePagination from "@/app/base/hooks/usePagination/usePagination";
import { useSidePanel } from "@/app/base/side-panel-context";
import { AddUser } from "@/app/settings/views/UserManagement/views/UsersList/components";

const UsersTable = () => {
  const { openSidePanel } = useSidePanel();
  const [searchText, setSearchText] = useState("");
  const { page, debouncedPage, size, handlePageSizeChange, setPage } =
    usePagination();
  const canEdit = useHasEntitlements([Entitlement.CAN_EDIT_IDENTITIES]);
  const users = useUsers({
    query: { page: debouncedPage, size, username_or_email: searchText },
  });

  const columns = useUsersTableColumns({
    canEdit,
    statisticsPending: users.statisticsPending,
  });

  return (
    <div className="users-table">
      <MainToolbar>
        <MainToolbar.Title>Users</MainToolbar.Title>
        <MainToolbar.Controls>
          <SearchBox
            onChange={setSearchText}
            placeholder="Search users"
            value={searchText}
          />
          <Button
            disabled={!canEdit}
            onClick={() => {
              openSidePanel({ component: AddUser, title: "Add user" });
            }}
          >
            Add user
          </Button>
        </MainToolbar.Controls>
      </MainToolbar>
      <GenericTable
        columns={columns}
        data={users.data?.items ?? []}
        isLoading={users.isPending}
        noData="No users found."
        pagination={{
          currentPage: page,
          dataContext: "users",
          handlePageSizeChange: handlePageSizeChange,
          isPending: users.isPending,
          itemsPerPage: size,
          setCurrentPage: setPage,
          totalItems: users.data?.total ?? 0,
        }}
        sorting={[{ id: "username", desc: false }]}
      />
    </div>
  );
};

export default UsersTable;
