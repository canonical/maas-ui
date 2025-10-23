import { useState, type ReactElement } from "react";

import { FormikField } from "@canonical/react-components";
import * as Yup from "yup";

import {
  useCreateOauthProvider,
  useUpdateOauthProvider,
} from "@/app/api/query/auth";
import type { OAuthProviderResponse } from "@/app/apiclient";
import FormikForm from "@/app/base/components/FormikForm";

type Props = {
  provider: OAuthProviderResponse | undefined;
};

type SingleSignOnFormValues = Omit<OAuthProviderResponse, "enabled" | "id">;

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
      updateOauthProvider.mutate({
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
      });
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
      validationSchema={SingleSignOnSchema}
    >
      <FormikField
        help="A unique, human-readable name identifying the OIDC provider."
        label="Name"
        name="name"
        required
        type="text"
      />
      <FormikField
        help="The client ID issued by the OIDC provider to identify your application."
        label="Client ID"
        name="client_id"
        required
        type="text"
      />
      <FormikField
        help="The client secret issued by the OIDC provider, used to authenticate your application securely."
        label="Client secret"
        name="client_secret"
        required
        type="text"
      />
      <FormikField
        help="The base URL of the OIDC provider's authorization server."
        label="Issuer URL"
        name="issuer_url"
        required
        type="text"
      />
      <FormikField
        help="The callback URL in your application where the OIDC provider will redirect users after successful authentication."
        label="Redirect URI"
        name="redirect_uri"
        required
        type="text"
      />
      <FormikField
        help="A space-separated list of OIDC scopes defining the information requested from the provider."
        label="Scopes"
        name="scopes"
        required
        type="text"
      />
    </FormikForm>
  );
};

export default SingleSignOnForm;
