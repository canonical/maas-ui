import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { actions as scriptResultActions } from "app/store/scriptresult";
import scriptResultSelectors from "app/store/scriptresult/selectors";
import {
  ScriptResultNames,
  ScriptResultStatus,
} from "app/store/scriptresult/types";
import type {
  ScriptResult,
  ScriptResultData,
} from "app/store/scriptresult/types";

/**
 * Fetch the installation log for a machine.
 * @param systemId - The machine id.
 * @returns The toggle callback.
 */
export const useGetInstallationOutput = (
  systemId: Machine["system_id"]
): {
  log: ScriptResultData["combined"] | null;
  result: ScriptResult | null;
} => {
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) =>
    scriptResultSelectors.loading(state)
  );
  const scriptResults = useSelector((state: RootState) =>
    scriptResultSelectors.getByMachineId(state, systemId)
  );
  const installationResults = useSelector((state: RootState) =>
    scriptResultSelectors.getInstallationByMachineId(state, systemId)
  );
  const installationResult = (installationResults || []).find(
    ({ name }) => name === ScriptResultNames.INSTALL_LOG
  );
  const log = useSelector((state: RootState) =>
    scriptResultSelectors.getLogById(state, installationResult?.id)
  );

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
      installationResult &&
      [ScriptResultStatus.PASSED, ScriptResultStatus.FAILED].includes(
        installationResult?.status
      )
    ) {
      dispatch(scriptResultActions.getLogs(installationResult.id, "combined"));
    }
  }, [dispatch, installationResult, log, installationResults, scriptResults]);

  return { log: log?.combined || null, result: installationResult || null };
};
