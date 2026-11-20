import type { ReactElement } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import { Link, Notification, Spinner } from "@canonical/react-components";
import { InlineCode } from "@canonical/react-ds-global";

import HardeningStatusTable from "./components/HardeningStatusTable";
import { parseHardeningNotifications } from "./utils";

import {
  isHardeningNotification,
  useActiveNotifications,
} from "@/app/api/query/notifications";
import { useSystemInfo } from "@/app/api/query/system";
import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";

const HARDENING_DOCS_URL = `${import.meta.env.VITE_APP_BASENAME}/docs/reference/configuration-guides/security-hardening/`;

const HardeningStatus = (): ReactElement => {
  useWindowTitle("Hardening status");

  const systemInfo = useSystemInfo();
  const notifications = useActiveNotifications();
  const requirements = parseHardeningNotifications(
    notifications.data?.items.filter(isHardeningNotification) ?? []
  );

  return (
    <PageContent>
      <ContentSection>
        <ContentSection.Title className="section-header__title">
          Hardening status
        </ContentSection.Title>
        <ContentSection.Content>
          {systemInfo.isError ? (
            <Notification
              severity="negative"
              title="Error while fetching system information"
            >
              {systemInfo.error.message}
            </Notification>
          ) : systemInfo.isPending ? (
            <Spinner text="Loading..." />
          ) : systemInfo.data?.hardening_active ? (
            <>
              <p>
                Hardening requirements that are not met are listed below, along
                with the <code>maas config-hardening set</code> command that
                resolves each one. This view is read-only; changes made with the
                command take effect on the next region restart.
              </p>
              {notifications.isError ? (
                <Notification
                  severity="negative"
                  title="Error while fetching hardening notifications"
                >
                  {notifications.error.message}
                </Notification>
              ) : (
                <HardeningStatusTable
                  isLoading={notifications.isPending}
                  requirements={requirements}
                />
              )}
            </>
          ) : (
            <>
              <p>
                Hardening is not enabled. Enable it by running the following
                command on a region controller; the change takes effect on the
                next region restart.
              </p>
              <pre className="p-code-block p-code-block--linux-prompt">
                <InlineCode>maas config-hardening enable</InlineCode>
              </pre>
              <p>
                <Link
                  href={HARDENING_DOCS_URL}
                  rel="noreferrer"
                  target="_blank"
                >
                  Learn more about security hardening
                </Link>
              </p>
            </>
          )}
        </ContentSection.Content>
      </ContentSection>
    </PageContent>
  );
};

export default HardeningStatus;
