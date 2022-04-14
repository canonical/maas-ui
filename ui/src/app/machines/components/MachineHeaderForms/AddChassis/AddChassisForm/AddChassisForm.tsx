import { useEffect, useState } from "react";

import { Link, Spinner, Strip } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import AddChassisFormFields from "../AddChassisFormFields";

import FormikFormContent from "app/base/components/FormikFormContent";
import { useAddMessage } from "app/base/hooks";
import type { ClearHeaderContent } from "app/base/types";
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

type Props = {
  clearHeaderContent: ClearHeaderContent;
};

type AddChassisParams = { [x: string]: string };

export const AddChassisForm = ({ clearHeaderContent }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const chassisPowerTypes = useSelector(powerTypesSelectors.canProbe);
  const domains = useSelector(domainSelectors.all);
  const domainsLoaded = useSelector(domainSelectors.loaded);
  const machineErrors = useSelector(machineSelectors.errors);
  const machineSaved = useSelector(machineSelectors.saved);
  const machineSaving = useSelector(machineSelectors.saving);
  const powerTypesLoaded = useSelector(powerTypesSelectors.loaded);

  const [powerType, setPowerType] = useState<PowerType | null>(null);
  const [secondarySubmit, setSecondarySubmit] = useState(false);
  const [savingChassis, setSavingChassis] = useState<string | null>(null);

  useEffect(() => {
    dispatch(domainActions.fetch());
    dispatch(generalActions.fetchPowerTypes());
  }, [dispatch]);

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
        <Strip shallow>
          <Spinner text="Loading" />
        </Strip>
      ) : (
        <Formik
          initialValues={{
            domain: (domains.length && domains[0].name) || "",
            power_parameters: initialPowerParameters,
            power_type: "",
          }}
          onSubmit={(values) => {
            const params: AddChassisParams = {
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
          validationSchema={AddChassisSchema}
        >
          <FormikFormContent<AddChassisParams>
            buttonsHelp={
              <p>
                <Link
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
            onCancel={clearHeaderContent}
            onSaveAnalytics={{
              action: secondarySubmit ? "Save and add another" : "Save",
              category: "Chassis",
              label: "Add chassis form",
            }}
            onSuccess={() => {
              if (!secondarySubmit) {
                clearHeaderContent();
              }
              setSecondarySubmit(false);
            }}
            onValuesChanged={(values) => {
              const powerType = chassisPowerTypes.find(
                (type) => type.name === values.power_type
              );
              if (powerType) {
                setPowerType(powerType);
              }
            }}
            resetOnSave
            saving={machineSaving}
            saved={machineSaved}
            secondarySubmit={(_, { submitForm }) => {
              setSecondarySubmit(true);
              submitForm();
            }}
            secondarySubmitLabel="Save and add another"
            submitLabel="Save chassis"
          >
            <AddChassisFormFields />
          </FormikFormContent>
        </Formik>
      )}
    </>
  );
};

export default AddChassisForm;
