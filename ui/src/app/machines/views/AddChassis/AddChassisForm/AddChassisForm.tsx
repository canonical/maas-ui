import { useEffect, useState } from "react";

import { Link, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";

import AddChassisFormFields from "../AddChassisFormFields";

import FormCard from "app/base/components/FormCard";
import FormikForm from "app/base/components/FormikForm";
import { useAddMessage, useWindowTitle } from "app/base/hooks";
import machineURLs from "app/machines/urls";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";
import { actions as generalActions } from "app/store/general";
import { powerTypes as powerTypesSelectors } from "app/store/general/selectors";
import type { PowerType } from "app/store/general/types";
import { PowerFieldScope } from "app/store/general/types";
import {
  formatPowerParameters,
  generatePowerParametersSchema,
  useInitialPowerParameters,
} from "app/store/general/utils";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";

export const AddChassisForm = (): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();

  const chassisPowerTypes = useSelector(powerTypesSelectors.canProbe);
  const domains = useSelector(domainSelectors.all);
  const domainsLoaded = useSelector(domainSelectors.loaded);
  const machineErrors = useSelector(machineSelectors.errors);
  const machineSaved = useSelector(machineSelectors.saved);
  const machineSaving = useSelector(machineSelectors.saving);
  const powerTypesLoaded = useSelector(powerTypesSelectors.loaded);

  const [powerType, setPowerType] = useState<PowerType | null>(null);
  const [resetOnSave, setResetOnSave] = useState(false);
  const [savingChassis, setSavingChassis] = useState<string | null>(null);

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
    () => setSavingChassis(null)
  );

  const initialPowerParameters = useInitialPowerParameters({}, true);
  const powerParametersSchema = generatePowerParametersSchema(powerType, [
    PowerFieldScope.BMC,
  ]);
  const AddChassisSchema = Yup.object().shape({
    domain: Yup.string().required("Domain required"),
    power_parameters: Yup.object().shape(powerParametersSchema),
    power_type: Yup.string().required("Power type required"),
  });

  return (
    <>
      {!(domainsLoaded && powerTypesLoaded) ? (
        <Spinner text="Loading" />
      ) : (
        <FormCard sidebar={false} title="Add chassis">
          <FormikForm
            buttonsHelp={
              <p>
                <Link
                  external
                  href="https://maas.io/docs/add-machines#heading--add-nodes-via-a-chassis"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Help with adding chassis
                </Link>
              </p>
            }
            cleanup={machineActions.cleanup}
            errors={machineErrors}
            initialValues={{
              domain: (domains.length && domains[0].name) || "",
              power_parameters: initialPowerParameters,
              power_type: "",
            }}
            onCancel={() =>
              history.push({ pathname: machineURLs.machines.index })
            }
            onSaveAnalytics={{
              action: resetOnSave ? "Save and add another" : "Save",
              category: "Chassis",
              label: "Add chassis form",
            }}
            onSubmit={(values) => {
              const params: { [x: string]: string } = {
                chassis_type: values.power_type,
                domain: values.domain,
              };
              const powerParams = formatPowerParameters(
                powerType,
                values.power_parameters,
                [PowerFieldScope.BMC],
                true
              );
              Object.entries(powerParams).forEach(([key, value]) => {
                params[key] = value.toString();
              });
              dispatch(machineActions.addChassis(params));
              setSavingChassis(params.hostname?.toString() || "chassis");
            }}
            onValuesChanged={(values) => {
              const powerType = chassisPowerTypes.find(
                (type) => type.name === values.power_type
              );
              if (powerType) {
                setPowerType(powerType);
              }
            }}
            resetOnSave={resetOnSave}
            saving={machineSaving}
            saved={machineSaved}
            savedRedirect={resetOnSave ? undefined : machineURLs.machines.index}
            secondarySubmit={(_, { submitForm }) => {
              setResetOnSave(true);
              submitForm();
            }}
            secondarySubmitLabel="Save and add another"
            submitLabel="Save chassis"
            validationSchema={AddChassisSchema}
          >
            <AddChassisFormFields />
          </FormikForm>
        </FormCard>
      )}
    </>
  );
};

export default AddChassisForm;
