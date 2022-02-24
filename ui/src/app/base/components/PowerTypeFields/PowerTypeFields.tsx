import type { ReactNode } from "react";
import { useEffect } from "react";

import { Select, Spinner } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";

import BasePowerField from "./BasePowerField";
import type { LXDPowerFieldsProps } from "./LXDPowerFields";
import LXDPowerFields from "./LXDPowerFields";

import FormikField from "app/base/components/FormikField";
import type { AnyObject } from "app/base/types";
import { actions as generalActions } from "app/store/general";
import { PowerTypeNames } from "app/store/general/constants";
import { powerTypes as powerTypesSelectors } from "app/store/general/selectors";
import { PowerFieldScope } from "app/store/general/types";

type Props = {
  customFieldProps?: {
    [PowerTypeNames.LXD]?: Partial<LXDPowerFieldsProps>;
  };
  disableFields?: boolean;
  disableSelect?: boolean;
  forChassis?: boolean;
  powerParametersValueName?: string;
  powerTypeValueName?: string;
  fieldScopes?: PowerFieldScope[];
  showSelect?: boolean;
};

export const PowerTypeFields = <V extends AnyObject>({
  customFieldProps,
  disableFields = false,
  disableSelect = false,
  forChassis = false,
  powerParametersValueName = "power_parameters",
  powerTypeValueName = "power_type",
  fieldScopes = [PowerFieldScope.BMC, PowerFieldScope.NODE],
  showSelect = true,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const allPowerTypes = useSelector(powerTypesSelectors.get);
  const chassisPowerTypes = useSelector(powerTypesSelectors.canProbe);
  const powerTypesLoaded = useSelector(powerTypesSelectors.loaded);
  const {
    handleChange,
    initialErrors,
    initialTouched,
    setErrors,
    setFieldValue,
    setTouched,
    values,
  } = useFormikContext<V>();

  useEffect(() => {
    dispatch(generalActions.fetchPowerTypes());
  }, [dispatch]);

  // Only power types that can probe are suitable for use when adding a chassis.
  const powerTypes = forChassis ? chassisPowerTypes : allPowerTypes;

  // Generate field content depending on loading status, custom field content
  // if provided, or on the fields of the selected power type.
  let fieldContent: ReactNode = null;
  const selectedPowerType = powerTypes.find(
    (type) => type.name === values[powerTypeValueName]
  );
  if (!powerTypesLoaded) {
    fieldContent = <Spinner text="Loading..." />;
  } else if (selectedPowerType) {
    const fieldsInScope = selectedPowerType.fields.filter((field) =>
      fieldScopes.includes(field.scope)
    );
    switch (selectedPowerType.name) {
      case PowerTypeNames.LXD:
        fieldContent = (
          <LXDPowerFields
            disabled={disableFields}
            fields={fieldsInScope}
            powerParametersValueName={powerParametersValueName}
            {...(customFieldProps?.lxd || {})}
          />
        );
        break;
      default:
        fieldContent = fieldsInScope.map((field) => (
          <BasePowerField
            disabled={disableFields}
            field={field}
            key={field.name}
            powerParametersValueName={powerParametersValueName}
          />
        ));
    }
  }

  return (
    <>
      {showSelect && (
        <FormikField
          component={Select}
          disabled={!powerTypesLoaded || disableSelect}
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
          onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => {
            // Reset errors and touched formik state when selecting a new power
            // type, in order to start validation from new.
            await handleChange(e);
            setErrors(initialErrors);
            setTouched(initialTouched);

            const powerType = powerTypes.find(
              (type) => type.name === e.target.value
            );
            // Explicitly set the fields of the selected power type to defaults.
            // This is necessary because some field names are shared across
            // power types (e.g. "power_address"), meaning the value would otherwise
            // persist and appear to be a default value, even though it isn't.
            if (powerType) {
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
      {fieldContent}
    </>
  );
};

export default PowerTypeFields;
