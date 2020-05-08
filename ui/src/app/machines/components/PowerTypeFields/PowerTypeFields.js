import { Input, Select } from "@canonical/react-components";
import React from "react";

import FormikField from "app/base/components/FormikField";

const generateFields = (powerTypeFields, forChassis) => {
  // When adding a chassis we need only a subset of fields that aren't specific
  // to individual nodes.
  const fields = forChassis
    ? powerTypeFields.filter((field) => field.scope !== "node")
    : [...powerTypeFields];

  return fields.map((field) => {
    const { choices, field_type, label, name, required } = field;
    return (
      <FormikField
        component={field_type === "choice" ? Select : Input}
        key={name}
        label={label}
        name={`power_parameters.${name}`}
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
  });
};

export const PowerTypeFields = ({
  forChassis = false,
  formikProps,
  powerTypes,
  selectedPowerType,
}) => {
  const { setFieldTouched, setFieldValue } = formikProps;
  const powerTypeOptions = [
    { label: "Select your power type", value: "", disabled: true },
    ...powerTypes.map((powerType) => ({
      key: `power-type-${powerType.name}`,
      label: powerType.description,
      value: powerType.name,
    })),
  ];
  const powerType = powerTypes.find((type) => type.name === selectedPowerType);

  return (
    <>
      <FormikField
        component={Select}
        label="Power type"
        name="power_type"
        options={powerTypeOptions}
        onChange={(e) => {
          setFieldValue("power_type", e.target.value);
          setFieldTouched("power_type", false);
        }}
        required
      />
      {powerType && generateFields(powerType.fields, forChassis)}
    </>
  );
};

export default PowerTypeFields;
