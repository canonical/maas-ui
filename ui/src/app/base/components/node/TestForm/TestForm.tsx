import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import type { NodeActionFormProps } from "../types";

import TestFormFields from "./TestFormFields";

import ActionForm from "app/base/components/ActionForm";
import type { HardwareType } from "app/base/enum";
import { actions as scriptActions } from "app/store/script";
import scriptSelectors from "app/store/script/selectors";
import type { Script } from "app/store/script/types";
import { getObjectString } from "app/store/script/utils";
import type { Node } from "app/store/types/node";
import { NodeActions } from "app/store/types/node";
import { capitaliseFirst } from "app/utils";

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

type Props<E = null> = NodeActionFormProps<E> & {
  applyConfiguredNetworking?: Script["apply_configured_networking"];
  cleanup: NonNullable<NodeActionFormProps<E>["cleanup"]>;
  hardwareType?: HardwareType;
  onTest: (args: FormValues & { systemId: Node["system_id"] }) => void;
};

export const TestForm = <E,>({
  applyConfiguredNetworking,
  cleanup,
  clearHeaderContent,
  errors,
  hardwareType,
  modelName,
  nodes,
  onTest,
  processingCount,
  viewingDetails,
}: Props<E>): JSX.Element => {
  const dispatch = useDispatch();
  const scripts = useSelector(scriptSelectors.testing);
  const scriptsLoaded = useSelector(scriptSelectors.loaded);
  const urlScripts = useSelector(scriptSelectors.testingWithUrl);

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
    <ActionForm<FormValues, E>
      actionName={NodeActions.TEST}
      allowUnchanged
      cleanup={cleanup}
      errors={errors}
      initialValues={{
        enableSSH: false,
        scripts: preselected,
        scriptInputs: initialScriptInputs,
      }}
      loaded={scriptsLoaded}
      modelName={modelName}
      onCancel={clearHeaderContent}
      onSaveAnalytics={{
        action: "Submit",
        category: `${capitaliseFirst(modelName)} ${
          viewingDetails ? "details" : "list"
        } action form`,
        label: "Test",
      }}
      onSubmit={(values) => {
        dispatch(cleanup());
        const { enableSSH, scripts, scriptInputs } = values;
        nodes.forEach((node) => {
          onTest({
            systemId: node.system_id,
            scripts,
            enableSSH,
            scriptInputs,
          });
        });
      }}
      onSuccess={clearHeaderContent}
      processingCount={processingCount}
      selectedCount={nodes.length}
      validationSchema={TestFormSchema}
    >
      <TestFormFields
        modelName={modelName}
        preselected={preselected}
        scripts={formattedScripts}
      />
    </ActionForm>
  );
};

export default TestForm;
