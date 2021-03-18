import { useEffect } from "react";

import { CodeSnippet, Spinner } from "@canonical/react-components";
import { CodeSnippetBlockAppearance } from "@canonical/react-components/dist/components/CodeSnippet";
import { useDispatch, useSelector } from "react-redux";

import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { actions as scriptResultActions } from "app/store/scriptresult";
import scriptResultSelectors from "app/store/scriptresult/selectors";

type Props = { systemId: Machine["system_id"] };

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

  const [log] = installationLogs || [];

  useEffect(() => {
    // If the script results for this machine haven't been loaded yet then
    // request them.
    if (!scriptResults?.length && !loading) {
      dispatch(scriptResultActions.getByMachineId(systemId));
    }
  }, [dispatch, scriptResults, loading, systemId]);

  useEffect(() => {
    if (!log && installationResults) {
      // We expect there to only be one result, but loop through the results to
      // be sure.
      installationResults.forEach((result) => {
        dispatch(scriptResultActions.getLogs(result.id, "combined"));
      });
    }
  }, [dispatch, log, installationResults]);

  if (!machine || !log) {
    return <Spinner text="Loading..." />;
  }

  return (
    <CodeSnippet
      blocks={[
        {
          appearance: CodeSnippetBlockAppearance.NUMBERED,
          code: log.combined,
        },
      ]}
    />
  );
};

export default InstallationOutput;
