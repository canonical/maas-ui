import {
  GenericTable,
  MainToolbar,
  useSidePanel,
} from "@canonical/maas-react-components";
import { Button, Notification } from "@canonical/react-components";

import AddTrustedSSHHostKey from "../AddTrustedSSHHostKey";

import useTrustedSSHHostKeysTableColumns from "./useTrustedSSHHostKeysTableColumns";

import { useTrustedSshHostKeys } from "@/app/api/query/trustedSshHostKeys";
import { useHasEntitlements } from "@/app/base/hooks";
import usePagination from "@/app/base/hooks/usePagination/usePagination";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";

const TrustedSSHHostKeysTable = () => {
  const { openSidePanel } = useSidePanel();
  const canEdit = useHasEntitlements([Entitlement.CAN_EDIT_CONFIGURATIONS]);
  const { page, debouncedPage, size, handlePageSizeChange, setPage } =
    usePagination();

  const { data, isPending, isError, error } = useTrustedSshHostKeys({
    query: {
      page: debouncedPage,
      size,
    },
  });

  const columns = useTrustedSSHHostKeysTableColumns({ canEdit });

  return (
    <div className="trusted-ssh-host-keys-table">
      <MainToolbar>
        <MainToolbar.Title>Trusted SSH host keys</MainToolbar.Title>
        <MainToolbar.Controls>
          <Button
            disabled={!canEdit}
            onClick={() => {
              openSidePanel({
                component: AddTrustedSSHHostKey,
                title: "Add SSH host key",
              });
            }}
          >
            Add SSH key
          </Button>
        </MainToolbar.Controls>
      </MainToolbar>
      {isError && (
        <Notification
          severity="negative"
          title="Error while fetching trusted SSH host keys"
        >
          {error.message}
        </Notification>
      )}
      <GenericTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isPending}
        noData="No trusted SSH host keys found."
        pagination={{
          currentPage: page,
          dataContext: "trusted SSH host keys",
          handlePageSizeChange: handlePageSizeChange,
          isPending: isPending,
          itemsPerPage: size,
          setCurrentPage: setPage,
          totalItems: data?.total ?? 0,
        }}
      />
    </div>
  );
};

export default TrustedSSHHostKeysTable;
