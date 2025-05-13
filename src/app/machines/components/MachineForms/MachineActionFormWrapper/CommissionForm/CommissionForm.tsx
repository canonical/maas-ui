import { Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import * as Yup from "yup";

import CommissionFormFields from "./CommissionFormFields";
import type { CommissionFormValues, FormattedScript } from "./types";

import ActionForm from "@/app/base/components/ActionForm";
import { useFetchActions, useGetURLId } from "@/app/base/hooks";
import urls from "@/app/base/urls";
import type { MachineActionFormProps } from "@/app/machines/types";
import { machineActions } from "@/app/store/machine";
import {
  MachineMeta,
  type MachineEventErrors,
} from "@/app/store/machine/types";
import { isUnconfiguredPowerType } from "@/app/store/machine/utils/common";
import {
  useFetchMachine,
  useSelectedMachinesActionsDispatch,
} from "@/app/store/machine/utils/hooks";
import { scriptActions } from "@/app/store/script";
import scriptSelectors from "@/app/store/script/selectors";
import type { Script } from "@/app/store/script/types";
import { ScriptName } from "@/app/store/script/types";
import { getObjectString } from "@/app/store/script/utils";
import { NodeActions } from "@/app/store/types/node";
import { simpleSortByKey } from "@/app/utils";

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

type ScriptInput = Record<string, { url: string }>;

type Props = MachineActionFormProps;

export const CommissionForm = ({
  clearSidePanelContent,
  errors,
  machines,
  processingCount,
  selectedCount,
  searchFilter,
  viewingDetails,
  selectedMachines,
}: Props): React.ReactElement => {
  const id = useGetURLId(MachineMeta.PK);
  const { machine } = useFetchMachine(id);
  const dispatch = useDispatch();
  const { dispatch: dispatchForSelectedMachines, ...actionProps } =
    useSelectedMachinesActionsDispatch({ selectedMachines, searchFilter });
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

  useFetchActions([scriptActions.fetch]);

  return (
    <ActionForm<CommissionFormValues, MachineEventErrors>
      actionName={NodeActions.COMMISSION}
      allowUnchanged
      cleanup={machineActions.cleanup}
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
      onCancel={clearSidePanelContent}
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${viewingDetails ? "details" : "list"} action form`,
        label: "Commission",
      }}
      onSubmit={(values) => {
        dispatch(machineActions.cleanup());
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
        const commissioningScriptsParam = commissioningScripts.map(
          (script) => script.name
        );
        if (updateFirmware) {
          commissioningScriptsParam.push(ScriptName.UPDATE_FIRMWARE);
        }
        if (configureHBA) {
          commissioningScriptsParam.push(ScriptName.CONFIGURE_HBA);
        }
        const testingScriptsParam = testingScripts.length
          ? testingScripts.map((script) => script.name)
          : [ScriptName.NONE];
        if (selectedMachines) {
          dispatchForSelectedMachines(machineActions.commission, {
            commissioning_scripts: commissioningScriptsParam,
            enable_ssh: enableSSH,
            script_input: scriptInputs,
            skip_bmc_config: skipBMCConfig,
            skip_networking: skipNetworking,
            skip_storage: skipStorage,
            testing_scripts: testingScriptsParam,
          });
        } else {
          machines?.forEach((machine) => {
            dispatch(
              machineActions.commission({
                commissioning_scripts: commissioningScriptsParam,
                enable_ssh: enableSSH,
                script_input: scriptInputs,
                skip_bmc_config: skipBMCConfig,
                skip_networking: skipNetworking,
                skip_storage: skipStorage,
                system_id: machine.system_id,
                testing_scripts: testingScriptsParam,
              })
            );
          });
        }
      }}
      onSuccess={clearSidePanelContent}
      processingCount={processingCount}
      selectedCount={machines ? machines.length : (selectedCount ?? 0)}
      validationSchema={CommissionFormSchema}
      {...actionProps}
    >
      {machine && isUnconfiguredPowerType(machine) && (
        <Notification severity="negative" title="Error">
          Unconfigured power type. Please{" "}
          <Link to={urls.machines.machine.configuration(id ? { id } : null)}>
            configure the power type{" "}
          </Link>
          and try again.
        </Notification>
      )}
      <CommissionFormFields
        commissioningScripts={formatScripts(commissioningScripts)}
        preselectedCommissioning={formatScripts(preselectedCommissioningSorted)}
        preselectedTesting={formatScripts(preselectedTestingScripts)}
        testingScripts={formatScripts(testingScripts)}
      />
    </ActionForm>
  );
};

export default CommissionForm;
