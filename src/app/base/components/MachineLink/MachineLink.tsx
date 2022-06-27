import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom-v5-compat";

import machineURLs from "app/machines/urls";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine, MachineMeta } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type Props = {
  systemId?: Machine[MachineMeta.PK] | null;
};

export enum Labels {
  Loading = "Loading machines",
}

const MachineLink = ({ systemId }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const machinesLoading = useSelector(machineSelectors.loading);

  useEffect(() => {
    dispatch(machineActions.fetch());
  }, [dispatch]);

  if (machinesLoading) {
    return <Spinner aria-label={Labels.Loading} />;
  }
  if (!machine) {
    return null;
  }
  return (
    <Link to={machineURLs.machine.index({ id: machine.system_id })}>
      <strong>{machine.hostname}</strong>
      <span>.{machine.domain.name}</span>
    </Link>
  );
};

export default MachineLink;
