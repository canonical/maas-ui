import { Spinner } from "@canonical/react-components";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";

import { actions as machineActions } from "app/store/machine";
import { general as generalActions } from "app/base/actions";
import { useAddMessage, useWindowTitle } from "app/base/hooks";
import {
  formatPowerParameters,
  generatePowerParametersSchema,
  useInitialPowerParameters,
} from "app/store/general/utils";
import { actions as domainActions } from "app/store/domain";
import AddChassisFormFields from "../AddChassisFormFields";
import domainSelectors from "app/store/domain/selectors";
import FormCard from "app/base/components/FormCard";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import generalSelectors from "app/store/general/selectors";
import { PowerFieldScope } from "app/store/general/types";
import machineSelectors from "app/store/machine/selectors";

export const AddChassisForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const chassisPowerTypes = useSelector(generalSelectors.powerTypes.canProbe);
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
    () => setSavingChassis(false)
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
            buttons={FormCardButtons}
            buttonsHelpLabel="Help with adding chassis"
            buttonsHelpLink="https://maas.io/docs/add-machines#heading--add-nodes-via-a-chassis"
            cleanup={machineActions.cleanup}
            errors={machineErrors}
            initialValues={{
              domain: (domains.length && domains[0].name) || "",
              power_parameters: initialPowerParameters,
              power_type: "",
            }}
            onCancel={() => history.push({ pathname: "/machines" })}
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
                  [PowerFieldScope.BMC],
                  true
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
            validationSchema={AddChassisSchema}
          >
            <AddChassisFormFields chassisPowerTypes={chassisPowerTypes} />
          </FormikForm>
        </FormCard>
      )}
    </>
  );
};

export default AddChassisForm;
