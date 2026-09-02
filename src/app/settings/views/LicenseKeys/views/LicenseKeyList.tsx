import { ContentSection } from "@canonical/maas-react-components";

import { Entitlement } from "../../UserManagement/views/Groups/constants";

import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle, useHasEntitlements } from "@/app/base/hooks";
import LicenseKeyTable from "@/app/settings/views/LicenseKeys/components/LicenseKeyTable/LicenseKeyTable";

const LicenseKeyList = (): React.ReactElement => {
  const canEdit = useHasEntitlements([Entitlement.CAN_EDIT_LICENSE_KEYS]);
  useWindowTitle("License keys");

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
