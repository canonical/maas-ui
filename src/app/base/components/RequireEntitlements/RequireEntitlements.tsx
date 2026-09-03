import type { ReactElement, ReactNode } from "react";

import PageContent from "@/app/base/components/PageContent";
import SectionHeader from "@/app/base/components/SectionHeader";
import { useHasEntitlements } from "@/app/base/hooks/permissions";
import type { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";

type Props = {
  children: ReactNode;
  entitlements: Entitlement[];
};

const RequireEntitlements = ({
  children,
  entitlements,
}: Props): ReactElement => {
  const hasEntitlements = useHasEntitlements(entitlements);

  if (!hasEntitlements) {
    return (
      <PageContent
        header={
          <SectionHeader title="You do not have permission to view this page." />
        }
      />
    );
  }

  return <>{children}</>;
};

export default RequireEntitlements;
