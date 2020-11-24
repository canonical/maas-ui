import React, { useEffect } from "react";

import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import CommissionFormFields from "./CommissionFormFields";

import { scripts as scriptActions } from "app/base/actions";
import ActionForm from "app/base/components/ActionForm";
import { useMachineActionForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import scriptSelectors from "app/store/scripts/selectors";
import { simpleSortByKey } from "app/utils";

import type { MachineAction } from "app/store/general/types";
import type { Scripts } from "app/store/scripts/types";

const formatScripts = (scripts: Scripts[]) =>
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

export type CommissionFormValues = {
  enableSSH: boolean;
  skipBMCConfig: boolean;
  skipNetworking: boolean;
  skipStorage: boolean;
  updateFirmware: boolean;
  configureHBA: boolean;
  commissioningScripts: Scripts[];
  testingScripts: Scripts[];
  scriptInputs: ScriptInput[];
};

type Props = {
  setSelectedAction: (action: MachineAction | null, deselect?: boolean) => void;
};

export const CommissionForm = ({ setSelectedAction }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const activeMachine = useSelector(machineSelectors.active);
  const errors = useSelector(machineSelectors.errors);
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
  const { machinesToAction, processingCount } = useMachineActionForm(
    "commission"
  );

  const preselectedTestingScripts = [
    testingScripts.find((script) => script.name === "smartctl-validate"),
  ].filter(Boolean);

  const initialScriptInputs = urlScripts.reduce<ScriptInput>(
    (scriptInputs, script) => {
      if (
        !(script.name in scriptInputs) &&
        script.parameters &&
        script.parameters.url
      ) {
        scriptInputs[script.name] = { url: script.parameters.url.default };
      }
      return scriptInputs;
    },
    {}
  );

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
        commissioningScripts: preselectedCommissioningSorted,
        testingScripts: preselectedTestingScripts,
        scriptInputs: initialScriptInputs,
      }}
      loaded={scriptsLoaded}
      modelName="machine"
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${activeMachine ? "details" : "list"} action form`,
        label: "Commission",
      }}
      onSubmit={(values: CommissionFormValues) => {
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
        machinesToAction.forEach((machine) => {
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
      processingCount={processingCount}
      selectedCount={machinesToAction.length}
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
  setSelectedAction: PropTypes.func.isRequired,
};

export default CommissionForm;
