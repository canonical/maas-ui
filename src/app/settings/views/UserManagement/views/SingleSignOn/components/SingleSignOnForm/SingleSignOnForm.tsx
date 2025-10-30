import { useState, type ReactElement } from "react";

import { useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";

import SingleSignOnFormFields from "./SingleSignOnFormFields/SingleSignOnFormFields";
import type { SingleSignOnFormValues } from "./types";

import {
  useCreateOauthProvider,
  useUpdateOauthProvider,
} from "@/app/api/query/auth";
import type { OAuthProviderResponse } from "@/app/apiclient";
import { getOauthProviderQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";
import FormikForm from "@/app/base/components/FormikForm";

type Props = {
  provider: OAuthProviderResponse | undefined;
};

const SingleSignOnSchema = Yup.object().shape({
  name: Yup.string().required("Name is a required field."),
  client_id: Yup.string().required("Name is a required field."),
  client_secret: Yup.string().required("Name is a required field."),
  issuer_url: Yup.string().required("Name is a required field."),
  redirect_uri: Yup.string().required("Name is a required field."),
  scopes: Yup.string().required("Name is a required field."),
});

const SingleSignOnForm = ({ provider }: Props): ReactElement => {
  const [initialValues, setInitialValues] = useState<SingleSignOnFormValues>(
    provider ?? {
      name: "",
      client_id: "",
      client_secret: "",
      issuer_url: "",
      redirect_uri: "",
      scopes: "",
    }
  );

  const createOauthProvider = useCreateOauthProvider();
  const updateOauthProvider = useUpdateOauthProvider();
  const queryClient = useQueryClient();

  const handleCancel = () => {
    setInitialValues(
      provider ?? {
        name: "",
        client_id: "",
        client_secret: "",
        issuer_url: "",
        redirect_uri: "",
        scopes: "",
      }
    );
  };

  const handleSubmit = (values: SingleSignOnFormValues) => {
    if (provider) {
      updateOauthProvider.mutate(
        {
          body: {
            name: values.name,
            client_id: values.client_id,
            client_secret: values.client_secret,
            redirect_uri: values.redirect_uri,
            issuer_url: values.issuer_url,
            scopes: values.scopes,
            enabled: true,
          },
          path: { provider_id: provider.id },
        },
        {
          onSuccess: () => {
            return queryClient.invalidateQueries({
              queryKey: getOauthProviderQueryKey(),
            });
          },
        }
      );
    } else {
      createOauthProvider.mutate({
        body: {
          name: values.name,
          client_id: values.client_id,
          client_secret: values.client_secret,
          redirect_uri: values.redirect_uri,
          issuer_url: values.issuer_url,
          scopes: values.scopes,
          enabled: true,
        },
      });
    }
  };

  return (
    <FormikForm
      aria-label="Single sign-on form"
      errors={createOauthProvider.error || updateOauthProvider.error}
      initialValues={initialValues}
      onCancel={(_, { resetForm }) => {
        resetForm();
        handleCancel();
      }}
      onSubmit={handleSubmit}
      saved={createOauthProvider.isSuccess || updateOauthProvider.isSuccess}
      saving={createOauthProvider.isPending || updateOauthProvider.isPending}
      validationSchema={SingleSignOnSchema}
    >
      <SingleSignOnFormFields provider={provider} />
    </FormikForm>
  );
};

export default SingleSignOnForm;
