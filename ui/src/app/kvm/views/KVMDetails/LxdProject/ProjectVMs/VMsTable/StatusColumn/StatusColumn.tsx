import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import { isTransientStatus, useFormattedOS } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { getPowerIcon } from "app/utils";

type Props = {
  systemId: Machine["system_id"];
};

const getIcon = (machine: Machine) => {
  if (isTransientStatus(machine.status_code)) {
    return <Spinner data-test="status-icon" />;
  }
  return <i className={getPowerIcon(machine)} data-test="status-icon"></i>;
};

const StatusColumn = ({ systemId }: Props): JSX.Element => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const formattedOS = useFormattedOS(machine);

  if (!machine) {
    return <Spinner />;
  }
  return (
    <DoubleRow
      icon={getIcon(machine)}
      primary={machine.status}
      primaryTitle={machine.status}
      secondary={formattedOS}
      secondaryTitle={formattedOS}
    />
  );
};

export default StatusColumn;
