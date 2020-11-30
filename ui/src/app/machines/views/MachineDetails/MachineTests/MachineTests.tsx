import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { useWindowTitle } from "app/base/hooks";
import type { RouteParams } from "app/base/types";
import machineSelectors from "app/store/machine/selectors";
import { actions as nodeResultActions } from "app/store/noderesult";
import nodeResultSelectors from "app/store/noderesult/selectors";
import type { RootState } from "app/store/root/types";

const MachineTests = (): JSX.Element => {
  const dispatch = useDispatch();
  const params = useParams<RouteParams>();
  const { id } = params;

  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  useWindowTitle(`${machine?.fqdn || "Machine"} tests`);

  const result = useSelector((state: RootState) =>
    nodeResultSelectors.get(state, id)
  );

  const loading = useSelector((state: RootState) =>
    nodeResultSelectors.loading(state)
  );

  useEffect(() => {
    if (!result && !loading) {
      dispatch(nodeResultActions.get(id));
    }
  }, [dispatch, result, loading, id]);

  if (result) {
    const testResults = result.results.filter(
      (result) => result.result_type === 2
    );
    return (
      <ul>
        {testResults.map((result) => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    );
  }
  return <Spinner text="Loading..." />;
};

export default MachineTests;
