import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Link } from "react-router";

import DoubleRow from "@/app/base/components/DoubleRow";
import urls from "@/app/base/urls";
import machineSelectors from "@/app/store/machine/selectors";
import type { Machine } from "@/app/store/machine/types";
import type { RootState } from "@/app/store/root/types";

type Props = {
  systemId: Machine["system_id"];
};

const NameColumn = ({ systemId }: Props): React.ReactElement => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );

  if (!machine) {
    return <Spinner />;
  }
  return (
    <DoubleRow
      data-testid="name-col"
      primary={
        <Link to={urls.machines.machine.index({ id: machine.system_id })}>
          <strong>{machine.hostname}</strong>
        </Link>
      }
      primaryTitle={machine.hostname}
    />
  );
};

export default NameColumn;
