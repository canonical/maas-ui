import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import type { SetSelectedAction } from "../types";

import NetworkCard from "./NetworkCard";
import NumaCard from "./NumaCard";
import OverviewCard from "./OverviewCard";
import SystemCard from "./SystemCard";
import WorkloadCard from "./WorkloadCard";

import { useWindowTitle } from "app/base/hooks";
import type { RouteParams } from "app/base/types";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { RootState } from "app/store/root/types";

type Props = {
  setSelectedAction: SetSelectedAction;
};

const MachineSummary = ({ setSelectedAction }: Props): JSX.Element => {
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
      <OverviewCard id={id} setSelectedAction={setSelectedAction} />
      <SystemCard id={id} />
      <NumaCard id={id} />
      <NetworkCard id={id} setSelectedAction={setSelectedAction} />
      <WorkloadCard id={id} />
    </div>
  );
};

export default MachineSummary;
