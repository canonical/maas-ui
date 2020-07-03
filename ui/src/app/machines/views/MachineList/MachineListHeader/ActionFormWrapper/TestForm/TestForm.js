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
import TestFormFields from "./TestFormFields";

const TestFormSchema = Yup.object().shape({
  enableSSH: Yup.boolean(),
  scripts: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required(),
        displayName: Yup.string(),
        description: Yup.string(),
      })
    )
    .min(1, "You must select at least one script.")
    .required(),
  urls: Yup.object(),
});

export const TestForm = ({ setSelectedAction }) => {
  const dispatch = useDispatch();
  const selectedMachines = useSelector(machineSelectors.selected);
  const errors = useSelector(machineSelectors.errors);
  const testingSelected = useSelector(machineSelectors.testingSelected);
  const scripts = useSelector(scriptSelectors.testing);
  const urlScripts = useSelector(scriptSelectors.testingWithUrl);

  const formattedScripts = scripts.map((script) => ({
    ...script,
    displayName: `${script.name} (${script.tags.join(", ")})`,
  }));
  const preselected = [
    formattedScripts.find((script) => script.name === "smartctl-validate"),
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
      actionName="test"
      allowUnchanged
      cleanup={machineActions.cleanup}
      clearSelectedAction={() => setSelectedAction(null, true)}
      errors={errors}
      initialValues={{
        enableSSH: false,
        scripts: preselected,
        scriptInputs: initialScriptInputs,
      }}
      modelName="machine"
      onSubmit={(values) => {
        const { enableSSH, scripts, scriptInputs } = values;
        selectedMachines.forEach((machine) => {
          dispatch(
            machineActions.test(
              machine.system_id,
              scripts,
              enableSSH,
              scriptInputs
            )
          );
        });
      }}
      processingCount={testingSelected.length}
      selectedCount={selectedMachines.length}
      validationSchema={TestFormSchema}
    >
      <TestFormFields preselected={preselected} scripts={formattedScripts} />
    </ActionForm>
  );
};

TestForm.propTypes = {
  setSelectedAction: PropTypes.func.isRequired,
};

export default TestForm;
