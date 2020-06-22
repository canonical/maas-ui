import { Spinner } from "@canonical/react-components";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import {
  domain as domainActions,
  general as generalActions,
  machine as machineActions,
} from "app/base/actions";
import {
  domain as domainSelectors,
  general as generalSelectors,
  machine as machineSelectors,
} from "app/base/selectors";
import {
  useAddMessage,
  useAllPowerParameters,
  usePowerParametersSchema,
  useWindowTitle,
} from "app/base/hooks";
import { formatPowerParameters } from "app/utils";
import AddChassisFormFields from "../AddChassisFormFields";
import FormCard from "app/base/components/FormCard";
import FormikForm from "app/base/components/FormikForm";
import FormCardButtons from "app/base/components/FormCardButtons";

const generateChassisSchema = (parametersSchema) =>
  Yup.object().shape({
    domain: Yup.string().required("Domain required"),
    power_parameters: Yup.object().shape(parametersSchema),
    power_type: Yup.string().required("Power type required"),
  });

export const AddChassisForm = () => {
  const dispatch = useDispatch();

  const chassisPowerTypes = useSelector(generalSelectors.powerTypes.chassis);
  const domains = useSelector(domainSelectors.all);
  const domainsLoaded = useSelector(domainSelectors.loaded);
  const machineErrors = useSelector(machineSelectors.errors);
  const machineSaved = useSelector(machineSelectors.saved);
  const machineSaving = useSelector(machineSelectors.saving);
  const powerTypesLoaded = useSelector(generalSelectors.powerTypes.loaded);

  const [powerType, setPowerType] = useState("");
  const [resetOnSave, setResetOnSave] = useState(false);
  const [savingChassis, setSavingChassis] = useState(false);

  useEffect(() => {
    dispatch(domainActions.fetch());
    dispatch(generalActions.fetchPowerTypes());
  }, [dispatch]);

  useEffect(() => {
    if (machineSaved && resetOnSave) {
      setResetOnSave(false);
    }
  }, [machineSaved, resetOnSave]);

  useWindowTitle("Add chassis");

  useAddMessage(
    machineSaved,
    machineActions.cleanup,
    `Attempting to add machines from ${savingChassis}.`,
    setSavingChassis
  );

  const ChassisSchema = usePowerParametersSchema(
    powerType,
    generateChassisSchema,
    true
  );

  const allPowerParameters = useAllPowerParameters(chassisPowerTypes);

  let errors = "";
  if (machineErrors && typeof machineErrors === "string") {
    errors = machineErrors;
  } else if (machineErrors && typeof machineErrors === "object") {
    Object.keys(machineErrors).forEach((key) => {
      errors = errors + `${machineErrors[key]} `;
    });
  }

  return (
    <>
      {!(domainsLoaded && powerTypesLoaded) ? (
        <Spinner text="Loading" />
      ) : (
        <FormCard sidebar={false} title="Add chassis">
          <FormikForm
            buttons={FormCardButtons}
            cleanup={machineActions.cleanup}
            errors={errors}
            initialValues={{
              domain: (domains.length && domains[0].name) || "",
              power_parameters: allPowerParameters,
              power_type: "",
            }}
            onSaveAnalytics={{
              action: resetOnSave ? "Save and add another" : "Save",
              category: "Chassis",
              label: "Add chassis form",
            }}
            onSubmit={(values) => {
              const params = {
                chassis_type: values.power_type,
                domain: values.domain,
                ...formatPowerParameters(
                  powerType,
                  values.power_parameters,
                  "chassis"
                ),
              };
              dispatch(machineActions.addChassis(params));
              setSavingChassis(params.hostname || "chassis");
            }}
            onValuesChanged={(values) => {
              const powerType = chassisPowerTypes.find(
                (type) => type.name === values.power_type
              );
              setPowerType(powerType);
            }}
            resetOnSave={resetOnSave}
            saving={machineSaving}
            saved={machineSaved}
            savedRedirect={resetOnSave ? undefined : "/machines"}
            secondarySubmit={() => setResetOnSave(true)}
            secondarySubmitLabel="Save and add another"
            submitLabel="Save chassis"
            validationSchema={ChassisSchema}
          >
            <AddChassisFormFields chassisPowerTypes={chassisPowerTypes} />
          </FormikForm>
        </FormCard>
      )}
    </>
  );
};

export default AddChassisForm;
