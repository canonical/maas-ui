import React from "react";
import classNames from "classnames";
import { useSelector } from "react-redux";

import { machine as machineSelectors } from "app/base/selectors";

const PowerColumn = ({ systemId }) => {
  const machine = useSelector(state =>
    machineSelectors.getBySystemId(state, systemId)
  );

  const iconClass = classNames({
    "p-icon--power-on": machine.power_state === "on",
    "p-icon--power-off": machine.power_state === "off",
    "p-icon--power-error": machine.power_state === "error",
    "p-icon--power-unknown": machine.power_state === "unknown"
  });

  return (
    <div className="p-double-row--with-icon">
      <div className="p-double-row__icon">
        <i title={machine.power_state} className={iconClass}></i>
      </div>
      <div className="p-double-row__primary-row u-upper-case--first">
        <span data-test="power_state">{machine.power_state}</span>
      </div>
      <div className="p-double-row__secondary-row u-upper-case--first">
        <span
          className="u-text-overflow"
          title={machine.power_type}
          data-test="power_type"
        >
          {machine.power_type}
        </span>
      </div>
    </div>
  );
};

export default PowerColumn;
