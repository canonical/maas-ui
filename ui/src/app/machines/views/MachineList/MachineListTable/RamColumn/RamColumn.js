import { memo } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import machineSelectors from "app/store/machine/selectors";
import DoubleRow from "app/base/components/DoubleRow";
import ScriptStatus from "app/base/components/ScriptStatus";

export const RamColumn = ({ systemId }) => {
  const machine = useSelector((state) =>
    machineSelectors.getById(state, systemId)
  );

  return (
    <DoubleRow
      primary={
        <ScriptStatus
          hidePassedIcon
          scriptType={machine.memory_test_status}
          tooltipPosition="top-right"
        >
          <span data-test="memory">{machine.memory}</span>&nbsp;
          <small className="u-text--light">GiB</small>
        </ScriptStatus>
      }
      primaryClassName="u-align--right"
    />
  );
};

RamColumn.propTypes = {
  systemId: PropTypes.string.isRequired,
};

export default memo(RamColumn);
