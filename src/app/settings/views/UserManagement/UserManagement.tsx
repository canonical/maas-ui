import { Outlet } from "react-router";

import { useGetUserEntitlements } from "@/app/api/query/auth";
import PageContent from "@/app/base/components/PageContent";
import SectionHeader from "@/app/base/components/SectionHeader";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { hasPermissions } from "@/app/utils/permissions";

const UserManagement = (): React.ReactElement => {
  const userEntitlements = useGetUserEntitlements();
  const canViewUserManagement = hasPermissions(userEntitlements.data || [], [
    Entitlement.CAN_VIEW_IDENTITIES,
  ]);

  if (!canViewUserManagement) {
    return (
      <PageContent
        header={
          <SectionHeader title="You do not have permission to view this page." />
        }
      />
    );
  }

  return <Outlet />;
};

export default UserManagement;
