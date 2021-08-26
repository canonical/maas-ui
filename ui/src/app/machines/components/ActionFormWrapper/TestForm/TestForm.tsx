import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import TestFormFields from "./TestFormFields";

import ActionForm from "app/base/components/ActionForm";
import type { HardwareType } from "app/base/enum";
import type { ClearSelectedAction } from "app/base/types";
import { useMachineActionForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { MachineEventErrors } from "app/store/machine/types/base";
import { actions as scriptActions } from "app/store/script";
import scriptSelectors from "app/store/script/selectors";
import type { Script } from "app/store/script/types";
import { getObjectString } from "app/store/script/utils";
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
  scripts: Script[];
  scriptInputs: {
    [x: string]: { url: string };
  };
};

type Props = {
  actionDisabled?: boolean;
  applyConfiguredNetworking?: Script["apply_configured_networking"];
  hardwareType?: HardwareType;
  clearSelectedAction: ClearSelectedAction;
};

export const TestForm = ({
  actionDisabled,
  applyConfiguredNetworking,
  hardwareType,
  clearSelectedAction,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const activeMachine = useSelector(machineSelectors.active);
  const scripts = useSelector(scriptSelectors.testing);
  const scriptsLoaded = useSelector(scriptSelectors.loaded);
  const urlScripts = useSelector(scriptSelectors.testingWithUrl);
  const { errors, machinesToAction, processingCount } = useMachineActionForm(
    NodeActions.TEST
  );

  type FormattedScript = Script & {
    displayName: string;
  };

  const formattedScripts = scripts.map<FormattedScript>((script) => ({
    ...script,
    displayName: `${script.name} (${script.tags.join(", ")})`,
  }));

  let preselected: FormattedScript[] = [];
  if (hardwareType) {
    preselected = formattedScripts.filter(
      (script) => script?.hardware_type === hardwareType
    );
  } else if (applyConfiguredNetworking) {
    preselected = formattedScripts.filter(
      (script) =>
        script?.apply_configured_networking === applyConfiguredNetworking
    );
  } else {
    const formattedScript = formattedScripts.find(
      (script) => script.name === "smartctl-validate"
    );
    if (formattedScript) {
      preselected = [formattedScript];
    }
  }
  const initialScriptInputs = urlScripts.reduce<FormValues["scriptInputs"]>(
    (scriptInputs, script) => {
      if (
        !(script.name in scriptInputs) &&
        script.parameters &&
        script.parameters.url
      ) {
        scriptInputs[script.name] = {
          url: getObjectString(script.parameters.url, "default") || "",
        };
      }
      return scriptInputs;
    },
    {}
  );

  useEffect(() => {
    if (!scriptsLoaded) {
      // scripts are fetched via http, so we explicitly check if they're already
      // loaded here.
      dispatch(scriptActions.fetch());
    }
  }, [dispatch, scriptsLoaded]);

  return (
    <ActionForm<FormValues, MachineEventErrors>
      actionDisabled={actionDisabled}
      actionName={NodeActions.TEST}
      allowUnchanged
      cleanup={machineActions.cleanup}
      clearSelectedAction={clearSelectedAction}
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
      onSubmit={(values) => {
        const { enableSSH, scripts, scriptInputs } = values;
        machinesToAction.forEach((machine) => {
          dispatch(
            machineActions.test({
              systemId: machine.system_id,
              scripts,
              enableSSH,
              scriptInputs,
            })
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

export default TestForm;
