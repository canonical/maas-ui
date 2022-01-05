import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { usePrevious } from "@canonical/react-components/dist/hooks";
import { useDispatch, useSelector } from "react-redux";

import MachineTestsTable from "../MachineTests/MachineTestsTable";

import { useWindowTitle } from "app/base/hooks";
import { useGetURLId } from "app/base/hooks/urls";
import machineSelectors from "app/store/machine/selectors";
import { MachineMeta } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { actions as scriptResultActions } from "app/store/scriptresult";
import scriptResultSelectors from "app/store/scriptresult/selectors";
import { TestStatusStatus } from "app/store/types/node";
import { isId } from "app/utils";

const MachineCommissioning = (): JSX.Element => {
  const dispatch = useDispatch();
  const id = useGetURLId(MachineMeta.PK);

  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  const previousCommissioningStatus = usePrevious(
    machine?.commissioning_status.status,
    true
  );
  useWindowTitle(`${machine?.fqdn || "Machine"} commissioning`);

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
    if (
      isId(id) &&
      !loading &&
      (!scriptResults?.length ||
        // Refetch the script results when the commissioning status changes to
        // pending, otherwise the new script results won't be associated with
        // the machine.
        (machine?.commissioning_status.status === TestStatusStatus.PENDING &&
          previousCommissioningStatus !== machine?.commissioning_status.status))
    ) {
      dispatch(scriptResultActions.getByMachineId(id));
    }
  }, [
    dispatch,
    previousCommissioningStatus,
    scriptResults,
    loading,
    machine,
    id,
  ]);

  if (isId(id) && scriptResults?.length) {
    return (
      <div>
        {commissioningResults?.length && commissioningResults.length > 0 ? (
          <MachineTestsTable
            machineId={id}
            scriptResults={commissioningResults}
          />
        ) : null}
      </div>
    );
  }
  return <Spinner text="Loading..." />;
};

export default MachineCommissioning;
