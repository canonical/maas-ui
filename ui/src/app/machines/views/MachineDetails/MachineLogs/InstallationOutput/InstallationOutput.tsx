import { useEffect } from "react";

import { CodeSnippet, Spinner } from "@canonical/react-components";
import { CodeSnippetBlockAppearance } from "@canonical/react-components/dist/components/CodeSnippet";
import { useDispatch, useSelector } from "react-redux";

import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import { PowerState } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { actions as scriptResultActions } from "app/store/scriptresult";
import scriptResultSelectors from "app/store/scriptresult/selectors";
import { ScriptResultStatus } from "app/store/scriptresult/types";
import type {
  ScriptResult,
  ScriptResultData,
} from "app/store/scriptresult/types";

type Props = { systemId: Machine["system_id"] };

const generateOutput = (
  machine: Machine,
  log: ScriptResultData | null,
  result: ScriptResult | null
) => {
  if (!result) {
    return "No installation result found.";
  }
  switch (result.status) {
    case ScriptResultStatus.PENDING:
      if (machine.power_state === PowerState.OFF) {
        return "System is off.";
      }
      return "System is booting...";
    case ScriptResultStatus.RUNNING:
      return "Installation has begun!";
    case ScriptResultStatus.PASSED:
      if (!log?.combined) {
        return "Installation has succeeded but no output was given.";
      }
      return log?.combined;
    case ScriptResultStatus.FAILED:
      if (!log?.combined) {
        return "Installation has failed and no output was given.";
      }
      return log?.combined;
    case ScriptResultStatus.TIMEDOUT:
      return "Installation failed after 40 minutes.";
    case ScriptResultStatus.ABORTED:
      return "Installation was aborted.";
    default:
      return `Unknown log status ${result.status}`;
  }
};

const InstallationOutput = ({ systemId }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const loading = useSelector((state: RootState) =>
    scriptResultSelectors.loading(state)
  );
  const scriptResults = useSelector((state: RootState) =>
    scriptResultSelectors.getByMachineId(state, systemId)
  );
  const installationLogs = useSelector((state: RootState) =>
    scriptResultSelectors.getInstallationLogsByMachineId(state, systemId)
  );
  const installationResults = useSelector((state: RootState) =>
    scriptResultSelectors.getInstallationByMachineId(state, systemId)
  );

  const [installationResult] = installationResults || [];
  const [log] = installationLogs || [];

  useEffect(() => {
    // If the script results for this machine haven't been loaded yet then
    // request them.
    if (!scriptResults?.length && !loading) {
      dispatch(scriptResultActions.getByMachineId(systemId));
    }
  }, [dispatch, scriptResults, loading, systemId]);

  useEffect(() => {
    if (
      !log &&
      installationResults &&
      [ScriptResultStatus.PASSED, ScriptResultStatus.FAILED].includes(
        installationResult?.status
      )
    ) {
      // We expect there to only be one result, but loop through the results to
      // be sure.
      installationResults.forEach((result) => {
        dispatch(scriptResultActions.getLogs(result.id, "combined"));
      });
    }
  }, [dispatch, installationResult, log, installationResults, scriptResults]);

  if (!machine) {
    return <Spinner text="Loading..." />;
  }

  return (
    <CodeSnippet
      blocks={[
        {
          appearance: CodeSnippetBlockAppearance.NUMBERED,
          code: generateOutput(machine, log, installationResult),
        },
      ]}
    />
  );
};

export default InstallationOutput;
