import { CodeSnippet, Spinner } from "@canonical/react-components";
import { CodeSnippetBlockAppearance } from "@canonical/react-components/dist/components/CodeSnippet";
import { useSelector } from "react-redux";

import { useGetInstallationOutput } from "../hooks";

import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import { PowerState } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import scriptResultSelectors from "app/store/scriptresult/selectors";
import { ScriptResultStatus } from "app/store/scriptresult/types";
import type {
  ScriptResult,
  ScriptResultData,
} from "app/store/scriptresult/types";

type Props = { systemId: Machine["system_id"] };

const generateOutput = (
  machine: Machine,
  log: ScriptResultData["combined"] | null,
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
      if (!log) {
        return "Installation has succeeded but no output was given.";
      }
      return log;
    case ScriptResultStatus.FAILED:
      if (!log) {
        return "Installation has failed and no output was given.";
      }
      return log;
    case ScriptResultStatus.TIMEDOUT:
      return "Installation failed after 40 minutes.";
    case ScriptResultStatus.ABORTED:
      return "Installation was aborted.";
    default:
      return `Unknown log status ${result.status}`;
  }
};

const InstallationOutput = ({ systemId }: Props): JSX.Element => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const loading = useSelector((state: RootState) =>
    scriptResultSelectors.loading(state)
  );
  const installationOutput = useGetInstallationOutput(systemId);

  if (!machine || loading) {
    return <Spinner text="Loading..." />;
  }

  return (
    <CodeSnippet
      blocks={[
        {
          appearance: CodeSnippetBlockAppearance.NUMBERED,
          code: generateOutput(
            machine,
            installationOutput.log,
            installationOutput.result
          ),
        },
      ]}
    />
  );
};

export default InstallationOutput;
