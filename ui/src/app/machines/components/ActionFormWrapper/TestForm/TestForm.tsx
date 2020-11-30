import { useEffect } from "react";

import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import TestFormFields from "./TestFormFields";

import { scripts as scriptActions } from "app/base/actions";
import ActionForm from "app/base/components/ActionForm";
import type { HardwareType } from "app/base/enum";
import { useMachineActionForm } from "app/machines/hooks";
import type { MachineAction } from "app/store/general/types";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import scriptSelectors from "app/store/scripts/selectors";
import type { Scripts } from "app/store/scripts/types";
import { NodeActions } from "app/store/types/node";

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

export type FormValues = {
  enableSSH: boolean;
  scripts: Scripts[];
  scriptInputs: {
    "internet-connectivity": { url: string };
  };
};

type Props = {
  setSelectedAction: (action: MachineAction | null, deselect?: boolean) => void;
  hardwareType?: HardwareType;
};

export const TestForm = ({
  setSelectedAction,
  hardwareType,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const activeMachine = useSelector(machineSelectors.active);
  const scripts = useSelector(scriptSelectors.testing);
  const scriptsLoaded = useSelector(scriptSelectors.loaded);
  const urlScripts = useSelector(scriptSelectors.testingWithUrl);
  const { errors, machinesToAction, processingCount } = useMachineActionForm(
    NodeActions.TEST
  );

  const formattedScripts = scripts.map((script) => ({
    ...script,
    displayName: `${script.name} (${script.tags.join(", ")})`,
  }));

  const preselected = hardwareType
    ? formattedScripts.filter(
        (script) => script?.hardware_type === hardwareType
      )
    : [
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
      actionName={NodeActions.TEST}
      allowUnchanged
      cleanup={machineActions.cleanup}
      clearSelectedAction={() => setSelectedAction(null, true)}
      errors={errors}
      initialValues={{
        enableSSH: false,
        scripts: preselected,
        scriptInputs: initialScriptInputs,
      }}
      loaded={scriptsLoaded}
      modelName="machine"
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${activeMachine ? "details" : "list"} action form`,
        label: "Test",
      }}
      onSubmit={(values: FormValues) => {
        const { enableSSH, scripts, scriptInputs } = values;
        machinesToAction.forEach((machine) => {
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
      processingCount={processingCount}
      selectedCount={machinesToAction.length}
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
