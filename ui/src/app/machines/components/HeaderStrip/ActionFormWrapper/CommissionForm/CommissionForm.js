import pluralize from "pluralize";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { getProcessingLabel } from "../utils";
import {
  machine as machineActions,
  scripts as scriptActions,
} from "app/base/actions";
import {
  machine as machineSelectors,
  scripts as scriptSelectors,
} from "app/base/selectors";
import { useProcessing } from "app/base/hooks";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import CommissionFormFields from "./CommissionFormFields";

const CommissionFormSchema = Yup.object().shape({
  enableSSH: Yup.boolean(),
  commissioningScripts: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required(),
      displayName: Yup.string(),
      description: Yup.string(),
    })
  ),
  testingScripts: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required(),
        displayName: Yup.string(),
        description: Yup.string(),
      })
    )
    .min(1, "You must select at least one script.")
    .required(),
});

export const CommissionForm = ({
  processing,
  setProcessing,
  setSelectedAction,
}) => {
  const dispatch = useDispatch();
  const selectedMachines = useSelector(machineSelectors.selected);
  const saved = useSelector(machineSelectors.saved);
  const errors = useSelector(machineSelectors.errors);
  const commissioningScripts = useSelector(scriptSelectors.commissioning);
  const urlScripts = useSelector(scriptSelectors.testingWithUrl);
  const testingScripts = useSelector(scriptSelectors.testing);
  const commissioningSelected = useSelector(
    machineSelectors.commissioningSelected
  );

  const formatScripts = (scripts) =>
    scripts.map((script) => ({
      ...script,
      displayName: `${script.name} (${script.tags.join(", ")})`,
    }));

  const formattedCommissioningScripts = formatScripts(commissioningScripts);
  const formattedTestingScripts = formatScripts(testingScripts);

  const preselectedTestingScripts = [
    formattedTestingScripts.find(
      (script) => script.name === "smartctl-validate"
    ),
  ].filter(Boolean);
  const initialScriptInputs = urlScripts.reduce((scriptInputs, script) => {
    if (
      !(script.name in scriptInputs) &&
      script.parameters &&
      script.parameters.url
    ) {
      scriptInputs[script.name] = { url: script.parameters.url.default };
    }
    return scriptInputs;
  }, {});

  useEffect(() => {
    dispatch(scriptActions.fetch());
  }, [dispatch]);

  useProcessing(
    commissioningSelected.length,
    () => {
      setProcessing(false);
      setSelectedAction(null);
    },
    Object.keys(errors).length > 0,
    () => setProcessing(false)
  );

  return (
    <FormikForm
      allowUnchanged
      buttons={FormCardButtons}
      buttonsBordered={false}
      errors={errors}
      cleanup={machineActions.cleanup}
      initialValues={{
        enableSSH: false,
        skipBMCConfig: false,
        skipNetworking: false,
        skipStorage: false,
        updateFirmware: false,
        configureHBA: false,
        commissioningScripts:
          commissioningScripts.length > 0 ? formattedCommissioningScripts : [],
        testingScripts: preselectedTestingScripts,
        scriptInputs: initialScriptInputs,
      }}
      submitLabel={`Commission ${selectedMachines.length} ${pluralize(
        "machine",
        selectedMachines.length
      )}`}
      onCancel={() => setSelectedAction(null, true)}
      onSaveAnalytics={{
        action: "Commission",
        category: "Take action menu",
        label: "Commission selected machines",
      }}
      onSubmit={(values) => {
        const {
          enableSSH,
          skipBMCConfig,
          skipNetworking,
          skipStorage,
          updateFirmware,
          configureHBA,
          commissioningScripts,
          testingScripts,
          scriptInputs,
        } = values;
        selectedMachines.forEach((machine) => {
          dispatch(
            machineActions.commission(
              machine.system_id,
              enableSSH,
              skipBMCConfig,
              skipNetworking,
              skipStorage,
              updateFirmware,
              configureHBA,
              commissioningScripts,
              testingScripts,
              scriptInputs
            )
          );
        });
        setProcessing(true);
      }}
      saving={processing}
      savingLabel={getProcessingLabel(
        commissioningSelected.length,
        selectedMachines.length,
        "commission"
      )}
      saved={saved}
      validationSchema={CommissionFormSchema}
    >
      <CommissionFormFields
        preselectedTesting={preselectedTestingScripts}
        preselectedCommissioning={commissioningScripts}
        commissioningScripts={formattedCommissioningScripts}
        testingScripts={formattedTestingScripts}
      />
    </FormikForm>
  );
};

CommissionForm.propTypes = {
  processing: PropTypes.bool,
  setProcessing: PropTypes.func.isRequired,
  setSelectedAction: PropTypes.func.isRequired,
};

export default CommissionForm;
