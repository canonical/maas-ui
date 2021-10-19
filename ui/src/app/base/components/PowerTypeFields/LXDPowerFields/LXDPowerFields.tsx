import type { ReactNode } from "react";
import { useState } from "react";

import { useFormikContext } from "formik";

import BasePowerField from "../BasePowerField";

import CertificateDetails from "app/base/components/CertificateDetails";
import CertificateFields from "app/base/components/CertificateFields";
import type { AnyObject } from "app/base/types";
import type { PowerField as PowerFieldType } from "app/store/general/types";
import type { MachineDetails } from "app/store/machine/types";

export type Props = {
  canEditCertificate?: boolean;
  disabled?: boolean;
  editing?: boolean;
  fields: PowerFieldType[];
  machine?: MachineDetails;
  powerParametersValueName?: string;
};

const CustomFields = {
  CERTIFICATE: "certificate",
  KEY: "key",
} as const;

export const LXDPowerFields = <V extends AnyObject>({
  canEditCertificate = true,
  disabled = false,
  editing = false,
  fields,
  machine,
  powerParametersValueName = "power_parameters",
}: Props): JSX.Element => {
  const [shouldGenerateCert, setShouldGenerateCert] = useState(
    !machine?.certificate
  );
  const { setFieldValue } = useFormikContext<V>();
  const certFieldName = `${powerParametersValueName}.${CustomFields.CERTIFICATE}`;
  const privateKeyFieldName = `${powerParametersValueName}.${CustomFields.KEY}`;

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

  let customFields: ReactNode;
  if (
    machine?.certificate &&
    machine?.power_parameters.certificate &&
    machine?.power_parameters.key &&
    !editing
  ) {
    // If certificate details exist and the user is not currently editing power
    // configuration, we display a custom read-only set of certificate data.
    customFields = (
      <CertificateDetails
        certificate={machine.power_parameters.certificate as string}
        eventCategory="Machine configuration"
        metadata={machine.certificate}
      />
    );
  } else if (canEditCertificate) {
    // Otherwise we display the fields for generating/providing a certificate
    // and key if the user is able to edit them.
    customFields = (
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
              machine?.power_parameters[CustomFields.CERTIFICATE] || ""
            );
            setFieldValue(
              privateKeyFieldName,
              machine?.power_parameters[CustomFields.KEY] || ""
            );
          }
        }}
        privateKeyFieldName={privateKeyFieldName}
        shouldGenerateCert={shouldGenerateCert}
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
