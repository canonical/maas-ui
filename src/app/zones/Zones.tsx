import { Outlet } from "react-router";

import PageContent from "@/app/base/components/PageContent";
import SectionHeader from "@/app/base/components/SectionHeader";
import { useHasEntitlements } from "@/app/base/hooks/permissions";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";

const Zones = (): React.ReactElement => {
  const canViewZones = useHasEntitlements([
    Entitlement.CAN_VIEW_GLOBAL_ENTITIES,
  ]);

  if (!canViewZones) {
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

export default Zones;
