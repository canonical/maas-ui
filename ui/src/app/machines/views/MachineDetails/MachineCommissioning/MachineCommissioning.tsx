import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import MachineCommissioningTable from "./MachineCommissioningTable";

import { useWindowTitle } from "app/base/hooks";
import type { RouteParams } from "app/base/types";
import machineSelectors from "app/store/machine/selectors";
import type { RootState } from "app/store/root/types";
import { actions as scriptResultActions } from "app/store/scriptresult";
import scriptResultSelectors from "app/store/scriptresult/selectors";

const MachineCommissioning = (): JSX.Element => {
  const dispatch = useDispatch();
  const params = useParams<RouteParams>();
  const { id } = params;

  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  useWindowTitle(`${machine?.fqdn || "Machine"} tests`);

  const scriptResults = useSelector((state: RootState) =>
    scriptResultSelectors.getByMachineId(state, id)
  );

  const commissioningResults = useSelector((state: RootState) =>
    scriptResultSelectors.getCommissioningByMachineId(state, id)
  );

  const loading = useSelector((state: RootState) =>
    scriptResultSelectors.loading(state)
  );

  useEffect(() => {
    if (!scriptResults?.length && !loading) {
      dispatch(scriptResultActions.getByMachineId(id));
    }
  }, [dispatch, scriptResults, loading, id]);

  if (scriptResults?.length) {
    return (
      <div>
        {commissioningResults?.length && commissioningResults.length > 0 ? (
          <>
            <MachineCommissioningTable scriptResults={commissioningResults} />
          </>
        ) : null}
      </div>
    );
  }
  return <Spinner text="Loading..." />;
};

export default MachineCommissioning;
