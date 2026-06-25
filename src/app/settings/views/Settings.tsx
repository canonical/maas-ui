import { Outlet } from "react-router";

import PageContent from "@/app/base/components/PageContent";
import SectionHeader from "@/app/base/components/SectionHeader";
import { useFetchActions, useHasEntitlements } from "@/app/base/hooks";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { configActions } from "@/app/store/config";

const Settings = (): React.ReactElement => {
  const canViewSettings = useHasEntitlements([
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
