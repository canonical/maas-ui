import type { ReactNode } from "react";
import { useState } from "react";

import { Textarea } from "@canonical/react-components";
import { useFormikContext } from "formik";

import BasePowerField from "../BasePowerField";

import AuthenticationFields from "app/base/components/AuthenticationFields";
import FormikField from "app/base/components/FormikField";
import type { AnyObject } from "app/base/types";
import type { PowerField as PowerFieldType } from "app/store/general/types";

export type Props = {
  disabled?: boolean;
  fields: PowerFieldType[];
  forConfiguration?: boolean;
  powerParametersValueName?: string;
};

const CustomFields = {
  CERTIFICATE: "certificate",
  KEY: "key",
  PASSWORD: "password",
} as const;

export const LXDPowerFields = <V extends AnyObject>({
  disabled = false,
  fields,
  forConfiguration = false,
  powerParametersValueName = "power_parameters",
}: Props): JSX.Element | null => {
  const [shouldGenerateCert, setShouldGenerateCert] = useState(true);
  const { setFieldValue } = useFormikContext<V>();
  const certName = `${powerParametersValueName}.${CustomFields.CERTIFICATE}`;
  const keyName = `${powerParametersValueName}.${CustomFields.KEY}`;
  const passwordName = `${powerParametersValueName}.${CustomFields.PASSWORD}`;

  const baseFields = fields.reduce<ReactNode[]>((content, field) => {
    const isCustom = Object.values(CustomFields).some(
      (val) => val === field.name
    );
    if (!isCustom) {
      content.push(
        <BasePowerField
          disabled={disabled}
          field={field}
          key={field.name}
          powerParametersValueName={powerParametersValueName}
        />
      );
    }
    return content;
  }, []);
  let customFields: ReactNode = null;

  if (forConfiguration) {
    // TODO: Render custom certificate section.
    // https://github.com/canonical-web-and-design/app-squad/issues/247
    customFields = (
      <div data-test="certificate-data">
        <FormikField
          disabled={disabled}
          label="LXD password (optional)"
          name={passwordName}
          type="password"
        />
        <FormikField
          component={Textarea}
          disabled={disabled}
          label="LXD certificate (optional)"
          name={certName}
          rows={5}
        />
        <FormikField
          component={Textarea}
          disabled={disabled}
          label="LXD private key (optional)"
          name={keyName}
          rows={5}
        />
      </div>
    );
  } else {
    customFields = (
      <AuthenticationFields
        certificateValueName={certName}
        onShouldGenerateCert={(shouldGenerateCert) => {
          setShouldGenerateCert(shouldGenerateCert);
          setFieldValue(certName, "");
          setFieldValue(keyName, "");
          setFieldValue(passwordName, "");
        }}
        passwordValueName={passwordName}
        privateKeyValueName={keyName}
        shouldGenerateCert={shouldGenerateCert}
        showPassword
      />
    );
  }
  return (
    <>
      {baseFields}
      {customFields}
    </>
  );
};

export default LXDPowerFields;
