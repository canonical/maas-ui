import { ContentSection } from "@canonical/maas-react-components";

import { Entitlement } from "../../UserManagement/views/Groups/constants";

import { useGetUserEntitlements } from "@/app/api/query/auth";
import PageContent from "@/app/base/components/PageContent";
import SectionHeader from "@/app/base/components/SectionHeader/SectionHeader";
import { useWindowTitle } from "@/app/base/hooks";
import LicenseKeyTable from "@/app/settings/views/LicenseKeys/components/LicenseKeyTable/LicenseKeyTable";
import { hasPermissions } from "@/app/utils/permissions";

const LicenseKeyList = (): React.ReactElement => {
  const userEntitlements = useGetUserEntitlements();
  const canView = hasPermissions(userEntitlements.data || [], [
    Entitlement.CAN_VIEW_LICENSE_KEYS,
  ]);
  const canEdit = hasPermissions(userEntitlements.data || [], [
    Entitlement.CAN_EDIT_LICENSE_KEYS,
  ]);
  useWindowTitle("License keys");

  if (!canView) {
    return (
      <PageContent
        header={
          <SectionHeader title="You do not have permission to view this page." />
        }
      />
    );
  }

  return (
    <PageContent>
      <ContentSection>
        <ContentSection.Content>
          <LicenseKeyTable canEdit={canEdit} />
        </ContentSection.Content>
      </ContentSection>
    </PageContent>
  );
};

export default LicenseKeyList;
