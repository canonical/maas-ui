import { useEffect, type ReactElement } from "react";

import { FormikField, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { SingleSignOnFormValues } from "../types";

import type { OAuthProviderResponse } from "@/app/apiclient";

type Props = {
  provider: OAuthProviderResponse | undefined;
};

const SingleSignOnFormFields = ({ provider }: Props): ReactElement => {
  const { resetForm } = useFormikContext<SingleSignOnFormValues>();

  useEffect(() => {
    if (!provider) {
      resetForm({
        values: {
          name: "",
          client_id: "",
          client_secret: "",
          issuer_url: "",
          redirect_uri: "",
          scopes: "",
          token_type: "JWT",
        },
      });
    }
  }, [provider, resetForm]);

  return (
    <>
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
      <FormikField
        component={Select}
        help="The type of access tokens issued by the OIDC provider (e.g., JWT or opaque). Note that encrypted JWT tokens should be treated as opaque."
        label="Token type"
        name="token_type"
        options={[
          { label: "Select token type", value: "", disabled: true },
          { label: "JWT", value: "JWT" },
          { label: "Opaque", value: "Opaque" },
        ]}
        required
      />
    </>
  );
};

export default SingleSignOnFormFields;
