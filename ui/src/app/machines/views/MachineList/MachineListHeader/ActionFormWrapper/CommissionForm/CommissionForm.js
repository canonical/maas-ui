import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import {
  machine as machineActions,
  scripts as scriptActions,
} from "app/base/actions";
import {
  machine as machineSelectors,
  scripts as scriptSelectors,
} from "app/base/selectors";
import ActionForm from "app/base/components/ActionForm";
import CommissionFormFields from "./CommissionFormFields";

const formatScripts = (scripts) =>
  scripts.map((script) => ({
    ...script,
    displayName: `${script.name} (${script.tags.join(", ")})`,
  }));

const CommissionFormSchema = Yup.object().shape({
  enableSSH: Yup.boolean(),
  commissioningScripts: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required(),
      displayName: Yup.string(),
      description: Yup.string(),
    })
  ),
  testingScripts: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required(),
      displayName: Yup.string(),
      description: Yup.string(),
    })
  ),
});

export const CommissionForm = ({ setSelectedAction }) => {
  const dispatch = useDispatch();
  const selectedMachines = useSelector(machineSelectors.selected);
  const errors = useSelector(machineSelectors.errors);
  const commissioningScripts = useSelector(scriptSelectors.commissioning);
  const urlScripts = useSelector(scriptSelectors.testingWithUrl);
  const testingScripts = useSelector(scriptSelectors.testing);
  const commissioningSelected = useSelector(
    machineSelectors.commissioningSelected
  );

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

  return (
    <ActionForm
      actionName="commission"
      allowUnchanged
      cleanup={machineActions.cleanup}
      clearSelectedAction={() => setSelectedAction(null, true)}
      errors={errors}
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
      modelName="machine"
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
      }}
      processingCount={commissioningSelected.length}
      selectedCount={selectedMachines.length}
      validationSchema={CommissionFormSchema}
    >
      <CommissionFormFields
        preselectedTesting={preselectedTestingScripts}
        preselectedCommissioning={commissioningScripts}
        commissioningScripts={formattedCommissioningScripts}
        testingScripts={formattedTestingScripts}
      />
    </ActionForm>
  );
};

CommissionForm.propTypes = {
  setSelectedAction: PropTypes.func.isRequired,
};

export default CommissionForm;
