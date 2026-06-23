import { Outlet } from "react-router";

import { useGetUserEntitlements } from "@/app/api/query/auth";
import PageContent from "@/app/base/components/PageContent";
import SectionHeader from "@/app/base/components/SectionHeader";
import { useFetchActions } from "@/app/base/hooks";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { configActions } from "@/app/store/config";
import { hasPermissions } from "@/app/utils/permissions";

const Settings = (): React.ReactElement => {
  const userEntitlements = useGetUserEntitlements();
  const canViewSettings = hasPermissions(userEntitlements.data || [], [
    Entitlement.CAN_VIEW_CONFIGURATIONS,
  ]);

  useFetchActions([configActions.fetch]);

  if (!canViewSettings) {
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

export default Settings;
