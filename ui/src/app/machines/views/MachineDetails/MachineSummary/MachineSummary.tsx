import { Card, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import React, { useEffect } from "react";

import { machine as machineActions } from "app/base/actions";
import { useWindowTitle } from "app/base/hooks";
import machineSelectors from "app/store/machine/selectors";
import NumaCard from "./NumaCard";
import SystemCard from "./SystemCard";
import type { RootState } from "app/store/root/types";

type RouteParams = {
  id: string;
};

const MachineSummary = (): JSX.Element => {
  const dispatch = useDispatch();
  const { id } = useParams<RouteParams>();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );

  useWindowTitle(`${`${machine?.fqdn} ` || "Machine"} details`);

  useEffect(() => {
    dispatch(machineActions.get(id));
  }, [dispatch, id]);

  if (!machine) {
    return <Spinner text="Loading" />;
  }

  return (
    <div className="machine-summary__cards">
      <Card className="machine-summary__overview-card">Overview</Card>
      <SystemCard id={id} />
      <NumaCard id={id} />
      <Card className="machine-summary__network-card">Network</Card>
    </div>
  );
};

export default MachineSummary;
