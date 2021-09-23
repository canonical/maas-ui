import { Input, Select } from "@canonical/react-components";

import FormikField from "app/base/components/FormikField";
import type { PowerField as PowerFieldType } from "app/store/general/types";

type Props = {
  disabled?: boolean;
  field: PowerFieldType;
  powerParametersValueName?: string;
};

export const BasePowerField = ({
  disabled = false,
  field,
  powerParametersValueName = "power_parameters",
}: Props): JSX.Element => {
  const { choices, field_type, label, name, required } = field;

  return (
    <FormikField
      component={field_type === "choice" ? Select : Input}
      disabled={disabled}
      key={name}
      label={label}
      name={`${powerParametersValueName}.${name}`}
      options={
        field_type === "choice"
          ? choices.map((choice) => ({
              key: `${name}-${choice[0]}`,
              label: choice[1],
              value: choice[0],
            }))
          : undefined
      }
      required={required}
      type={
        (field_type === "string" && "text") ||
        (field_type === "password" && "password") ||
        undefined
      }
    />
  );
};

export default BasePowerField;
