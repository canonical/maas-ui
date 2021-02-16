import { useEffect } from "react";

import { Input, Select, Spinner } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";

import { general as generalActions } from "app/base/actions";
import FormikField from "app/base/components/FormikField";
import generalSelectors from "app/store/general/selectors";
import type { PowerType } from "app/store/general/types";
import { PowerFieldScope } from "app/store/general/types";

type Props = {
  disableFields?: boolean;
  disableSelect?: boolean;
  forChassis?: boolean;
  powerParametersValueName?: string;
  powerTypeValueName?: string;
  fieldScopes?: PowerFieldScope[];
  showSelect?: boolean;
};

/**
 * Generate the fields to show, depending on the selected power type and the
 * given field scopes.
 * @param selectedPowerType - the power type that is selected.
 * @param disabled - whether all fields should be disabled.
 * @param fieldScopes - the scopes of the fields to show.
 * @param powerParametersValueName - the power parameters "name" in the Formik form
 * @returns list of Formik fields relevant to the chosen power type and field scopes.
 */
const generateFields = (
  selectedPowerType: PowerType,
  disabled: boolean,
  fieldScopes: PowerFieldScope[],
  powerParametersValueName: string
) =>
  selectedPowerType?.fields
    ?.filter((field) => fieldScopes.includes(field.scope))
    .map((field) => {
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
    });

export const PowerTypeFields = <F extends Record<string, unknown>>({
  disableFields = false,
  disableSelect = false,
  forChassis = false,
  powerParametersValueName = "power_parameters",
  powerTypeValueName = "power_type",
  fieldScopes = [PowerFieldScope.BMC, PowerFieldScope.NODE],
  showSelect = true,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const allPowerTypes = useSelector(generalSelectors.powerTypes.get);
  const chassisPowerTypes = useSelector(generalSelectors.powerTypes.canProbe);
  const powerTypesLoaded = useSelector(generalSelectors.powerTypes.loaded);
  const {
    handleChange,
    initialErrors,
    initialTouched,
    setErrors,
    setFieldValue,
    setTouched,
    values,
  } = useFormikContext<F>();

  // Only power types that can probe are suitable for use when adding a chassis.
  const powerTypes = forChassis ? chassisPowerTypes : allPowerTypes;
  const selectedPowerType = powerTypes.find(
    (type) => type.name === values[powerTypeValueName]
  );

  useEffect(() => {
    dispatch(generalActions.fetchPowerTypes());
  }, [dispatch]);

  if (!powerTypesLoaded) {
    return <Spinner text="Loading..." />;
  }
  return (
    <>
      {showSelect && (
        <FormikField
          component={Select}
          disabled={disableSelect}
          label="Power type"
          name={powerTypeValueName}
          options={[
            { label: "Select power type", value: "", disabled: true },
            ...powerTypes.map((powerType) => ({
              key: `power-type-${powerType.name}`,
              label: powerType.description,
              value: powerType.name,
            })),
          ]}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            // Reset errors and touched formik state when selecting a new power
            // type, in order to start validation from new.
            handleChange(e);
            setErrors(initialErrors);
            setTouched(initialTouched);

            const powerType = powerTypes.find(
              (type) => type.name === e.target.value
            );
            // Explicitly set the fields of the selected power type to defaults.
            // This is necessary because some field names are shared across
            // power types (e.g. "power_address"), meaning the value would otherwise
            // persist and appear to be a default value, even though it isn't.
            if (powerType?.fields.length) {
              powerType.fields.forEach((field) => {
                setFieldValue(
                  `${powerParametersValueName}.${field.name}`,
                  field.default || ""
                );
              });
            }
          }}
          required
        />
      )}
      {selectedPowerType &&
        generateFields(
          selectedPowerType,
          disableFields,
          fieldScopes,
          powerParametersValueName
        )}
    </>
  );
};

export default PowerTypeFields;
