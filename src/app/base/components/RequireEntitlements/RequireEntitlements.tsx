import type { ReactElement, ReactNode } from "react";

import { Layout } from "@canonical/maas-react-components";

import PageContent from "@/app/base/components/PageContent";
import SectionHeader from "@/app/base/components/SectionHeader";
import { useHasEntitlements } from "@/app/base/hooks/permissions";
import type { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";

type Props = {
  children: ReactNode;
  entitlements: Entitlement[];
  skeletonView?: "settings" | "table";
};

const RequireEntitlements = ({
  children,
  entitlements,
  skeletonView = "table",
}: Props): ReactElement => {
  const { allowed: hasEntitlements, isPending } =
    useHasEntitlements(entitlements);

  if (isPending) {
    return <Layout.Skeleton view={skeletonView} />;
  }

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
