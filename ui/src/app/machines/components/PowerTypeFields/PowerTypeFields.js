import { Input, Select } from "@canonical/react-components";

import FormikField from "app/base/components/FormikField";

const generateFields = (powerTypeFields, driverType) => {
  // When adding a chassis or pod we need only a subset of fields that aren't
  // specific to individual nodes.
  const fields =
    driverType === "node"
      ? [...powerTypeFields]
      : powerTypeFields.filter((field) => field.scope !== "node");

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
  driverType = "node",
  formikProps,
  powerTypes,
  selectedPowerType,
  showSelect = true,
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
      {showSelect && (
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
      )}
      {powerType && generateFields(powerType.fields, driverType)}
    </>
  );
};

export default PowerTypeFields;
