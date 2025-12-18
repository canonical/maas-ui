import { useMemo, type ReactElement } from "react";

import { ContentSection, MainToolbar } from "@canonical/maas-react-components";
import {
  Button,
  Notification,
  Spinner,
  Tooltip,
} from "@canonical/react-components";

import ResetSingleSignOn from "./components/ResetSingleSignOn";
import SingleSignOnForm from "./components/SingleSignOnForm";

import { useActiveOauthProvider } from "@/app/api/query/auth";
import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import { useSidePanel } from "@/app/base/side-panel-context-new";

const SingleSignOn = (): ReactElement => {
  const { data, error, isPending } = useActiveOauthProvider();
  const { openSidePanel } = useSidePanel();

  const queryData = useMemo(() => {
    if (error && error?.code === 404) {
      return undefined;
    }

    return data;
  }, [data, error]);

  useWindowTitle("OIDC/Single sign-on");

  return (
    <PageContent>
      <ContentSection variant="narrow">
        <ContentSection.Header>
          <MainToolbar>
            <MainToolbar.Title>OIDC/Single sign-on</MainToolbar.Title>
            <MainToolbar.Controls>
              <Tooltip
                message={
                  !queryData
                    ? "No single sign-on provider is configured."
                    : null
                }
              >
                <Button
                  appearance="negative"
                  disabled={!queryData}
                  onClick={() => {
                    if (data) {
                      openSidePanel({
                        component: ResetSingleSignOn,
                        props: { id: data?.id },
                        title: "Reset OIDC configuration",
                      });
                    }
                  }}
                >
                  Reset OIDC configuration
                </Button>
              </Tooltip>
            </MainToolbar.Controls>
          </MainToolbar>
          <ContentSection.Content>
            {isPending ? (
              <Spinner text="Loading..." />
            ) : // 404 errors can be excluded, as this will always happen when there is no active provider
            error && error.code != 404 ? (
              <Notification
                severity="negative"
                title="Error while fetching OIDC provider"
              >
                {error.message}
              </Notification>
            ) : (
              <SingleSignOnForm provider={queryData} />
            )}
          </ContentSection.Content>
        </ContentSection.Header>
      </ContentSection>
    </PageContent>
  );
};

export default SingleSignOn;
