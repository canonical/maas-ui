import { ContentSection } from "@canonical/maas-react-components";
import {
  CodeSnippet,
  CodeSnippetBlockAppearance,
  Link,
  Spinner,
} from "@canonical/react-components";
import { useSelector } from "react-redux";

import HardeningStatusTable from "./components/HardeningStatusTable";
import { parseHardeningNotifications } from "./utils";

import { useSystemInfo } from "@/app/api/query/system";
import { useFetchActions, useWindowTitle } from "@/app/base/hooks";
import { notificationActions } from "@/app/store/notification";
import notificationSelectors from "@/app/store/notification/selectors";

const HARDENING_DOCS_URL = `${import.meta.env.VITE_APP_BASENAME}/docs/reference/configuration-guides/security-hardening/`;

const HardeningStatus = (): React.ReactElement => {
  useWindowTitle("Hardening status");
  useFetchActions([notificationActions.fetch]);

  const systemInfo = useSystemInfo();
  const notifications = useSelector(notificationSelectors.hardening);
  const loaded = useSelector(notificationSelectors.loaded);
  const requirements = parseHardeningNotifications(notifications);

  return (
    <ContentSection>
      <ContentSection.Title className="section-header__title">
        Hardening status
      </ContentSection.Title>
      <ContentSection.Content>
        {systemInfo.isPending ? (
          <Spinner text="Loading..." />
        ) : systemInfo.data?.hardening_active ? (
          <>
            <p>
              Hardening requirements that are not met are listed below, along
              with the <code>maas config-hardening set</code> command that
              resolves each one. This view is read-only; changes made with the
              command take effect on the next region restart.
            </p>
            <HardeningStatusTable
              isLoading={!loaded}
              requirements={requirements}
            />
          </>
        ) : (
          <>
            <p>
              Hardening is not enabled. Enable it by running the following
              command on a region controller; the change takes effect on the
              next region restart.
            </p>
            <CodeSnippet
              blocks={[
                {
                  appearance: CodeSnippetBlockAppearance.LINUX_PROMPT,
                  code: "maas config-hardening enable",
                },
              ]}
            />
            <p>
              <Link href={HARDENING_DOCS_URL} rel="noreferrer" target="_blank">
                Learn more about security hardening
              </Link>
            </p>
          </>
        )}
      </ContentSection.Content>
    </ContentSection>
  );
};

export default HardeningStatus;
