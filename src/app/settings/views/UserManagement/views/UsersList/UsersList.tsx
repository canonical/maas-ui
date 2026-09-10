import type { ReactElement } from "react";

import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import { UsersTable } from "@/app/settings/views/UserManagement/views/UsersList/components";

const UsersList = (): ReactElement => {
  useWindowTitle("Users");

  return (
    <PageContent>
      <UsersTable />
    </PageContent>
  );
};

export default UsersList;
