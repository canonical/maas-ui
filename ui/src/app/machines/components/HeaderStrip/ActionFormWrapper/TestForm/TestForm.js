import pluralize from "pluralize";
import React, { useEffect, useState } from "react";
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
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import MachinesProcessing from "../MachinesProcessing";
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
  const [processing, setProcessing] = useState(false);
  const selectedMachines = useSelector(machineSelectors.selected);
  const saved = useSelector(machineSelectors.saved);
  const saving = useSelector(machineSelectors.saving);
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

  if (processing) {
    return (
      <MachinesProcessing
        hasErrors={Object.keys(errors).length > 0}
        machinesProcessing={testingSelected}
        setProcessing={setProcessing}
        setSelectedAction={setSelectedAction}
        action="test"
      />
    );
  }

  return (
    <FormikForm
      allowUnchanged
      buttons={FormCardButtons}
      buttonsBordered={false}
      errors={errors}
      cleanup={machineActions.cleanup}
      initialValues={{
        enableSSH: false,
        scripts: preselected,
        scriptInputs: initialScriptInputs,
      }}
      submitLabel={`Test ${selectedMachines.length} ${pluralize(
        "machine",
        selectedMachines.length
      )}`}
      onCancel={() => setSelectedAction(null)}
      onSaveAnalytics={{
        action: "Test",
        category: "Take action menu",
        label: "Test selected machines",
      }}
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
        setProcessing(true);
      }}
      saving={saving}
      saved={saved}
      validationSchema={TestFormSchema}
    >
      <TestFormFields preselected={preselected} scripts={formattedScripts} />
    </FormikForm>
  );
};

export default TestForm;
