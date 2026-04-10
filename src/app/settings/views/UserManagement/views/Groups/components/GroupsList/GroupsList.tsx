import { useState } from "react";

import { GenericTable, MainToolbar } from "@canonical/maas-react-components";
import { Button, SearchBox } from "@canonical/react-components";

import useGroupsListColumns from "./useGroupsListColumns/useGroupsListColumns";

import { useGroups } from "@/app/api/query/groups";
import usePagination from "@/app/base/hooks/usePagination/usePagination";

const GroupsList = () => {
  const [searchText, setSearchText] = useState("");
  const { page, debouncedPage, size, handlePageSizeChange, setPage } =
    usePagination();
  const columns = useGroupsListColumns();
  const groups = useGroups({
    query: { page: debouncedPage, size, group_name: searchText },
  });
  return (
    <div className="groups-list">
      <MainToolbar>
        <MainToolbar.Title>Groups</MainToolbar.Title>
        <MainToolbar.Controls>
          <SearchBox
            onChange={setSearchText}
            placeholder="Search groups"
            value={searchText}
          />
          <Button>Add group</Button>
        </MainToolbar.Controls>
      </MainToolbar>
      <GenericTable
        columns={columns}
        data={groups.data?.items ?? []}
        isLoading={groups.isPending}
        noData="No groups found."
        pagination={{
          currentPage: page,
          dataContext: "groups",
          handlePageSizeChange: handlePageSizeChange,
          isPending: groups.isPending,
          itemsPerPage: size,
          setCurrentPage: setPage,
          totalItems: groups.data?.total ?? 0,
        }}
      />
    </div>
  );
};
export default GroupsList;
