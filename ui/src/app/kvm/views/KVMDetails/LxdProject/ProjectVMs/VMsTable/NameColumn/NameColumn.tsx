import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import DoubleRow from "app/base/components/DoubleRow";
import RowCheckbox from "app/base/components/RowCheckbox";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { generateCheckboxHandlers } from "app/utils";

type Props = {
  systemId: Machine["system_id"];
};

const NameColumn = ({ systemId }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const selectedIDs = useSelector(machineSelectors.selectedIDs);
  const { handleRowCheckbox } = generateCheckboxHandlers<Machine["system_id"]>(
    (machineIDs) => {
      dispatch(machineActions.setSelected(machineIDs));
    }
  );

  if (!machine) {
    return <Spinner />;
  }
  return (
    <DoubleRow
      data-test="name-col"
      primary={
        <RowCheckbox
          checked={selectedIDs.includes(machine.system_id)}
          handleRowCheckbox={() =>
            handleRowCheckbox(machine.system_id, selectedIDs)
          }
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
