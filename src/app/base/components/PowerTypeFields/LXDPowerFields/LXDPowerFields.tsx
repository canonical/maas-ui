import type { ReactNode } from "react";
import { useState } from "react";

import { useFormikContext } from "formik";

import BasePowerField from "../BasePowerField";

import CertificateFields from "app/base/components/CertificateFields";
import type { AnyObject } from "app/base/types";
import type { PowerField as PowerFieldType } from "app/store/general/types";
import type { PowerParameters } from "app/store/types/node";

export type Props = {
  canEditCertificate?: boolean;
  fields: PowerFieldType[];
  initialShouldGenerateCert?: boolean;
  powerParametersValueName?: string;
};

export const CustomFields = {
  CERTIFICATE: "certificate",
  KEY: "key",
} as const;

export const LXDPowerFields = <V extends AnyObject>({
  canEditCertificate = true,
  fields,
  initialShouldGenerateCert = true,
  powerParametersValueName = "power_parameters",
}: Props): JSX.Element => {
  const [shouldGenerateCert, setShouldGenerateCert] = useState(
    initialShouldGenerateCert
  );
  const { initialValues, setFieldValue } = useFormikContext<V>();
  const certFieldName = `${powerParametersValueName}.${CustomFields.CERTIFICATE}`;
  const privateKeyFieldName = `${powerParametersValueName}.${CustomFields.KEY}`;
  const initialParameters = initialValues[
    powerParametersValueName
  ] as PowerParameters;

  const baseFields = fields.reduce<ReactNode[]>((content, field) => {
    const isCustom = Object.values(CustomFields).some(
      (val) => val === field.name
    );
    if (!isCustom) {
      content.push(
        <BasePowerField
          field={field}
          key={field.name}
          powerParametersValueName={powerParametersValueName}
        />
      );
    }
    return content;
  }, []);
  const customFields = canEditCertificate ? (
    <CertificateFields
      certificateFieldName={certFieldName}
      onShouldGenerateCert={(shouldGenerateCert) => {
        setShouldGenerateCert(shouldGenerateCert);
        if (shouldGenerateCert) {
          setFieldValue(certFieldName, "");
          setFieldValue(privateKeyFieldName, "");
        } else {
          setFieldValue(
            certFieldName,
            initialParameters[CustomFields.CERTIFICATE] || ""
          );
          setFieldValue(
            privateKeyFieldName,
            initialParameters[CustomFields.KEY] || ""
          );
        }
      }}
      privateKeyFieldName={privateKeyFieldName}
      shouldGenerateCert={shouldGenerateCert}
    />
  ) : null;
  return (
    <>
      {baseFields}
      {customFields}
    </>
  );
};

export default LXDPowerFields;
