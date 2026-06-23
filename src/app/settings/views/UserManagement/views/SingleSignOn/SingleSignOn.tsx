import { useEffect, useMemo, type ReactElement } from "react";

import { ContentSection, MainToolbar } from "@canonical/maas-react-components";
import {
  Button,
  Notification as NotificationBanner,
  Spinner,
  Tooltip,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import { Entitlement } from "../Groups/constants";

import ResetSingleSignOn from "./components/ResetSingleSignOn";
import SingleSignOnForm from "./components/SingleSignOnForm";

import {
  useActiveOauthProvider,
  useGetUserEntitlements,
} from "@/app/api/query/auth";
import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import { useSidePanel } from "@/app/base/side-panel-context";
import { generalActions } from "@/app/store/general";
import { maasURL } from "@/app/store/general/selectors";
import { hasPermissions } from "@/app/utils/permissions";

const SingleSignOn = (): ReactElement => {
  const { data, error, isPending } = useActiveOauthProvider();
  const { openSidePanel } = useSidePanel();
  const dispatch = useDispatch();
  const maasURLData = useSelector(maasURL.get);
  const userEntitlements = useGetUserEntitlements();
  const canEdit = hasPermissions(userEntitlements.data || [], [
    Entitlement.CAN_EDIT_IDENTITIES,
  ]);

  useEffect(() => {
    dispatch(generalActions.fetchMAASURL());
  }, [dispatch]);

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
                  disabled={!queryData || !canEdit}
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
              <NotificationBanner
                severity="negative"
                title="Error while fetching OIDC provider"
              >
                {error.message}
              </NotificationBanner>
            ) : (
              <SingleSignOnForm
                canEdit={canEdit}
                maasURL={maasURLData}
                provider={queryData}
              />
            )}
          </ContentSection.Content>
        </ContentSection.Header>
      </ContentSection>
    </PageContent>
  );
};

export default SingleSignOn;
