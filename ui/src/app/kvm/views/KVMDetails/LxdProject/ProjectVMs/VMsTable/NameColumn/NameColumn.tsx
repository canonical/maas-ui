import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import DoubleRow from "app/base/components/DoubleRow";
import RowCheckbox from "app/base/components/RowCheckbox";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type Props = {
  systemId: Machine["system_id"];
};

const NameColumn = ({ systemId }: Props): JSX.Element => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );

  if (!machine) {
    return <Spinner />;
  }
  return (
    <DoubleRow
      data-test="name-col"
      primary={
        <RowCheckbox
          handleRowCheckbox={() => null}
          item={systemId}
          items={[]}
          inputLabel={
            <Link to={`/machine/${machine.system_id}`}>
              <strong>{machine.hostname}</strong>
            </Link>
          }
        />
      }
      primaryTitle={machine.hostname}
    />
  );
};

export default NameColumn;
