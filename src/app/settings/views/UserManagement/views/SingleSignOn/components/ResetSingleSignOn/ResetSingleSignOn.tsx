import type { ReactElement } from "react";

import { Notification, Spinner } from "@canonical/react-components";

import {
  useActiveOauthProvider,
  useDeleteOauthProvider,
  useUpdateOauthProvider,
} from "@/app/api/query/auth";
import type { OAuthProviderResponse } from "@/app/apiclient";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useSidePanel } from "@/app/base/side-panel-context-new";

type Props = {
  id: OAuthProviderResponse["id"];
};

const ResetSingleSignOn = ({ id }: Props): ReactElement => {
  const { data, error, isPending } = useActiveOauthProvider();
  const eTag = data?.headers?.get("ETag");
  const updateProvider = useUpdateOauthProvider();
  const deleteProvider = useDeleteOauthProvider();
  const { closeSidePanel } = useSidePanel();

  if (error) {
    return (
      <Notification
        severity="negative"
        title="Error while fetching OIDC provider"
      >
        {error.message}
      </Notification>
    );
  }

  if (isPending || !data) {
    return <Spinner text="Loading..." />;
  }

  return (
    <ModelActionForm
      aria-label="Reset single sign-on configuration"
      errors={updateProvider.error || deleteProvider.error}
      initialValues={{}}
      message={
        <>
          Are you sure you want to reset the single sign-on provider settings?
          <span className="u-nudge-down--small">
            This will:
            <ul>
              <li>Remove all users associated with this provider</li>
              <li>Remove all settings for this provider, including secrets</li>
            </ul>
            This action is permanent and cannot be undone.
          </span>
        </>
      }
      modelType="single sign-on provider"
      onCancel={closeSidePanel}
      onSubmit={() => {
        updateProvider.mutate(
          {
            headers: {
              ETag: eTag,
            },
            path: { provider_id: id },
            body: { ...data, enabled: false },
          },
          {
            onSuccess: () => {
              deleteProvider.mutate(
                { path: { provider_id: id } },
                { onSuccess: closeSidePanel }
              );
            },
          }
        );
      }}
      saved={deleteProvider.isSuccess}
      saving={updateProvider.isPending || deleteProvider.isPending}
      submitLabel="Reset single sign-on configuration"
    />
  );
};

export default ResetSingleSignOn;
