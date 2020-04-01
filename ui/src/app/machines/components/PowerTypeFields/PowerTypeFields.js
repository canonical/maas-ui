import { Input, Select } from "@canonical/react-components";
import React from "react";

import FormikField from "app/base/components/FormikField";

export const PowerTypeFields = ({
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
      {powerType &&
        powerType.fields.map((field) => (
          <FormikField
            component={field.field_type === "choice" ? Select : Input}
            key={field.name}
            label={field.label}
            name={`power_parameters.${field.name}`}
            options={
              field.field_type === "choice"
                ? field.choices.map((choice) => ({
                    key: `${field.name}-${choice[0]}`,
                    label: choice[1],
                    value: choice[0],
                  }))
                : undefined
            }
            required={field.required}
            type={field.field_type === "password" ? "password" : "text"}
          />
        ))}
    </>
  );
};

export default PowerTypeFields;
