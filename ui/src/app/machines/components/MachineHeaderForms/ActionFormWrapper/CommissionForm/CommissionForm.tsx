import { useEffect } from "react";

import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import CommissionFormFields from "./CommissionFormFields";
import type { CommissionFormValues, FormattedScript } from "./types";

import ActionForm from "app/base/components/ActionForm";
import type { ClearHeaderContent } from "app/base/types";
import { useMachineActionForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import type { Machine, MachineEventErrors } from "app/store/machine/types";
import { actions as scriptActions } from "app/store/script";
import scriptSelectors from "app/store/script/selectors";
import type { Script } from "app/store/script/types";
import { getObjectString } from "app/store/script/utils";
import { NodeActions } from "app/store/types/node";
import { simpleSortByKey } from "app/utils";

const formatScripts = (scripts: Script[]): FormattedScript[] =>
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

type ScriptInput = {
  [x: string]: { url: string };
};

type Props = {
  actionDisabled?: boolean;
  clearHeaderContent: ClearHeaderContent;
  machines: Machine[];
  viewingDetails: boolean;
};

export const CommissionForm = ({
  actionDisabled,
  clearHeaderContent,
  machines,
  viewingDetails,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const scriptsLoaded = useSelector(scriptSelectors.loaded);
  const commissioningScripts = useSelector(scriptSelectors.commissioning);
  const preselectedCommissioningScripts = useSelector(
    scriptSelectors.preselectedCommissioning
  );
  const preselectedCommissioningSorted = preselectedCommissioningScripts.sort(
    simpleSortByKey("name")
  );
  const urlScripts = useSelector(scriptSelectors.testingWithUrl);
  const testingScripts = useSelector(scriptSelectors.testing);
  const { errors, processingCount } = useMachineActionForm(
    NodeActions.COMMISSION
  );

  const testingScript = testingScripts.find(
    (script) => script.name === "smartctl-validate"
  );
  const preselectedTestingScripts = testingScript ? [testingScript] : [];

  const initialScriptInputs = urlScripts.reduce<ScriptInput>(
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
    dispatch(scriptActions.fetch());
  }, [dispatch]);

  return (
    <ActionForm<CommissionFormValues, MachineEventErrors>
      actionDisabled={actionDisabled}
      actionName={NodeActions.COMMISSION}
      allowUnchanged
      cleanup={machineActions.cleanup}
      clearHeaderContent={clearHeaderContent}
      errors={errors}
      initialValues={{
        enableSSH: false,
        skipBMCConfig: false,
        skipNetworking: false,
        skipStorage: false,
        updateFirmware: false,
        configureHBA: false,
        commissioningScripts: preselectedCommissioningSorted,
        testingScripts: preselectedTestingScripts,
        scriptInputs: initialScriptInputs,
      }}
      loaded={scriptsLoaded}
      modelName="machine"
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${viewingDetails ? "details" : "list"} action form`,
        label: "Commission",
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
        machines.forEach((machine) => {
          dispatch(
            machineActions.commission({
              systemId: machine.system_id,
              enableSSH,
              skipBMCConfig,
              skipNetworking,
              skipStorage,
              updateFirmware,
              configureHBA,
              commissioningScripts,
              testingScripts,
              scriptInputs,
            })
          );
        });
      }}
      processingCount={processingCount}
      selectedCount={machines.length}
      validationSchema={CommissionFormSchema}
    >
      <CommissionFormFields
        preselectedTesting={formatScripts(preselectedTestingScripts)}
        preselectedCommissioning={formatScripts(preselectedCommissioningSorted)}
        commissioningScripts={formatScripts(commissioningScripts)}
        testingScripts={formatScripts(testingScripts)}
      />
    </ActionForm>
  );
};

CommissionForm.propTypes = {
  clearHeaderContent: PropTypes.func.isRequired,
};

export default CommissionForm;
