import type { ReactElement } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import { Notification, Spinner } from "@canonical/react-components";

import SingleSignOnForm from "./SingleSignOnForm";

import { useActiveOauthProvider } from "@/app/api/query/auth";
import { getOauthProviderQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";
import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";

const SingleSignOn = (): ReactElement => {
  const { data, error, isPending } = useActiveOauthProvider(undefined, {
    refetchOnWindowFocus: false,
    retry: false,
    queryKey: getOauthProviderQueryKey(),
  });

  useWindowTitle("OIDC/Single sign-on");

  return (
    <PageContent
      sidePanelContent={undefined}
      sidePanelTitle={null}
      useNewSidePanelContext={true}
    >
      <ContentSection variant="narrow">
        <ContentSection.Header>
          <ContentSection.Title>OIDC/Single sign-on</ContentSection.Title>
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
              <SingleSignOnForm provider={data} />
            )}
          </ContentSection.Content>
        </ContentSection.Header>
      </ContentSection>
    </PageContent>
  );
};

export default SingleSignOn;
