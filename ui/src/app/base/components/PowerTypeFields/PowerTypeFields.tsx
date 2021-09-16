import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { Input, Select, Spinner, Textarea } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";

import AuthenticationFields from "app/base/components/AuthenticationFields";
import FormikField from "app/base/components/FormikField";
import type { AnyObject } from "app/base/types";
import { actions as generalActions } from "app/store/general";
import { powerTypes as powerTypesSelectors } from "app/store/general/selectors";
import type { PowerType } from "app/store/general/types";
import { PowerFieldScope } from "app/store/general/types";

type Props = {
  disableFields?: boolean;
  disableSelect?: boolean;
  forChassis?: boolean;
  forConfiguration?: boolean;
  powerParametersValueName?: string;
  powerTypeValueName?: string;
  fieldScopes?: PowerFieldScope[];
  showSelect?: boolean;
};

const CustomFields = {
  LXD: {
    CERTIFICATE: "certificate",
    KEY: "key",
    PASSWORD: "password",
  },
} as const;

/**
 * Generate the fields to show, depending on the selected power type and the
 * given field scopes.
 * @param selectedPowerType - the power type that is selected.
 * @param disabled - whether all fields should be disabled.
 * @param fieldScopes - the scopes of the fields to show.
 * @param powerParametersValueName - the power parameters "name" in the Formik form
 * @param forConfiguration - whether the fields are being used for configuration of existing power parameters
 * @param generateCert - whether a certificate should be generated (LXD-only)
 * @param onShouldGenerateCert - function to run when changing certificate radio (LXD-only)
 * @returns list of Formik fields relevant to the chosen power type and field scopes.
 */
const generateFields = (
  selectedPowerType: PowerType,
  disabled: boolean,
  fieldScopes: PowerFieldScope[],
  powerParametersValueName: string,
  forConfiguration: boolean,
  shouldGenerateCert: boolean,
  onShouldGenerateCert: (shouldGeneraterCert: boolean) => void
) => {
  const baseFields: ReactNode[] = [];
  let customFields: ReactNode = null;
  const fieldsInScope = selectedPowerType.fields.filter((field) =>
    fieldScopes.includes(field.scope)
  );
  const isLxd = selectedPowerType.name === "lxd";

  fieldsInScope.forEach((field) => {
    // The authentication fields for the LXD power type are ignored here and
    // special-cased below. All other power type fields are generated directly
    // from the API data.
    if (
      isLxd &&
      Object.values(CustomFields.LXD).some((val) => val === field.name)
    ) {
      return;
    }
    const { choices, field_type, label, name, required } = field;
    baseFields.push(
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
  if (isLxd) {
    if (forConfiguration) {
      // TODO: Render custom certificate section.
      // https://github.com/canonical-web-and-design/app-squad/issues/247
      customFields = (
        <div data-test="certificate-data">
          <FormikField
            disabled={disabled}
            label="LXD password (optional)"
            name={`${powerParametersValueName}.${CustomFields.LXD.PASSWORD}`}
            type="password"
          />
          <FormikField
            component={Textarea}
            disabled={disabled}
            label="LXD certificate (optional)"
            name={`${powerParametersValueName}.${CustomFields.LXD.CERTIFICATE}`}
            rows={5}
          />
          <FormikField
            component={Textarea}
            disabled={disabled}
            label="LXD private key (optional)"
            name={`${powerParametersValueName}.${CustomFields.LXD.KEY}`}
            rows={5}
          />
        </div>
      );
    } else {
      customFields = (
        <AuthenticationFields
          certificateValueName={`${powerParametersValueName}.${CustomFields.LXD.CERTIFICATE}`}
          onShouldGenerateCert={onShouldGenerateCert}
          passwordValueName={`${powerParametersValueName}.${CustomFields.LXD.PASSWORD}`}
          privateKeyValueName={`${powerParametersValueName}.${CustomFields.LXD.KEY}`}
          shouldGenerateCert={shouldGenerateCert}
          showPassword
        />
      );
    }
  }
  return (
    <>
      {baseFields}
      {customFields}
    </>
  );
};

export const PowerTypeFields = <V extends AnyObject>({
  disableFields = false,
  disableSelect = false,
  forChassis = false,
  forConfiguration = false,
  powerParametersValueName = "power_parameters",
  powerTypeValueName = "power_type",
  fieldScopes = [PowerFieldScope.BMC, PowerFieldScope.NODE],
  showSelect = true,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const [shouldGenerateCert, setShouldGenerateCert] = useState(true);
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

  const onShouldGenerateCert = (shouldGenerateCert: boolean) => {
    setShouldGenerateCert(shouldGenerateCert);
    setFieldValue(`${powerParametersValueName}.certificate`, "");
    setFieldValue(`${powerParametersValueName}.key`, "");
    setFieldValue(`${powerParametersValueName}.password`, "");
  };

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
          powerParametersValueName,
          forConfiguration,
          shouldGenerateCert,
          onShouldGenerateCert
        )}
    </>
  );
};

export default PowerTypeFields;
