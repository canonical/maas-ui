import { Spinner } from "@canonical/react-components";
import { Link } from "react-router-dom-v5-compat";

import urls from "app/base/urls";
import type { Machine, MachineMeta } from "app/store/machine/types";
import { useGetMachine } from "app/store/machine/utils/hooks";

type Props = {
  systemId?: Machine[MachineMeta.PK] | null;
};

export enum Labels {
  Loading = "Loading machines",
}

const MachineLink = ({ systemId }: Props): JSX.Element | null => {
  const { machine, loading } = useGetMachine(systemId);

  if (loading) {
    return <Spinner aria-label={Labels.Loading} />;
  }
  if (!machine) {
    return null;
  }
  return (
    <Link to={urls.machines.machine.index({ id: machine.system_id })}>
      <strong>{machine.hostname}</strong>
      <span>.{machine.domain.name}</span>
    </Link>
  );
};

export default MachineLink;
