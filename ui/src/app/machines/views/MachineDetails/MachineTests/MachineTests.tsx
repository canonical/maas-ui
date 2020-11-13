import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import React, { useEffect } from "react";

import { useWindowTitle } from "app/base/hooks";
import type { RouteParams } from "app/base/types";
import machineSelectors from "app/store/machine/selectors";
import type { RootState } from "app/store/root/types";
import { actions as scriptResultsActions } from "app/store/scriptresults";
import scriptResultsSelectors from "app/store/scriptresults/selectors";

const MachineTests = (): JSX.Element => {
  const dispatch = useDispatch();
  const params = useParams<RouteParams>();
  const { id } = params;

  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );

  useWindowTitle(`${machine?.fqdn || "Machine"} tests`);

  const results = useSelector((state: RootState) =>
    scriptResultsSelectors.getByIds(state, [id])
  );

  useEffect(() => {
    dispatch(scriptResultsActions.get([id]));
  }, [dispatch, id]);

  if (results) {
    return <>{results.map((result) => result.results[0].name)}</>;
  }
  return <Spinner text="Loading..." />;
};

export default MachineTests;
