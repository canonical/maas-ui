import { Card, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import React, { useEffect } from "react";

import NumaCard from "./NumaCard";
import OverviewCard from "./OverviewCard";
import SystemCard from "./SystemCard";
import { machine as machineActions } from "app/base/actions";
import { useWindowTitle } from "app/base/hooks";
import type { RouteParams } from "app/base/types";
import type { MachineAction } from "app/store/general/types";
import machineSelectors from "app/store/machine/selectors";
import type { RootState } from "app/store/root/types";
import { HardwareType } from "app/base/enum";

export type SelectedAction = {
  name: MachineAction["name"];
  formProps?: { hardwareType: HardwareType };
};

export type SetSelectedAction = (
  action: SelectedAction | null,
  deselect?: boolean
) => void;

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
      <Card className="machine-summary__network-card">Network</Card>
    </div>
  );
};

export default MachineSummary;
