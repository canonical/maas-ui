import { Outlet } from "react-router";

import PageContent from "@/app/base/components/PageContent";
import SectionHeader from "@/app/base/components/SectionHeader";
import { useHasEntitlements } from "@/app/base/hooks";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";

const Images = (): React.ReactElement => {
  const canViewImages = useHasEntitlements([
    Entitlement.CAN_VIEW_BOOT_ENTITIES,
  ]);

  if (!canViewImages) {
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

export default Images;
