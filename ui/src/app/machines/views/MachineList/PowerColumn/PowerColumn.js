import { Loader } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import { machine as machineActions } from "app/base/actions";
import { machine as machineSelectors } from "app/base/selectors";
import DoubleRow from "app/base/components/DoubleRow";

const PowerColumn = ({ onToggleMenu, systemId }) => {
  const dispatch = useDispatch();
  const [updating, setUpdating] = useState(null);
  const machine = useSelector(state =>
    machineSelectors.getBySystemId(state, systemId)
  );

  const iconClass = classNames({
    "p-icon--power-on": machine.power_state === "on",
    "p-icon--power-off": machine.power_state === "off",
    "p-icon--power-error": machine.power_state === "error",
    "p-icon--power-unknown": machine.power_state === "unknown"
  });

  const menuLinks = [];

  const hasOnAction = machine.actions.includes("on");
  const hasOffAction = machine.actions.includes("off");
  const powerState = machine.power_state;
  let hasIcon = false;
  if (hasOnAction && powerState !== "on") {
    hasIcon = true;
    menuLinks.push({
      children: (
        <>
          <i className="p-icon--power-on"></i>Turn on
        </>
      ),
      onClick: () => {
        dispatch(machineActions.turnOn(systemId));
        setUpdating(machine.power_state);
      }
    });
  }
  if (hasOffAction && powerState !== "off") {
    hasIcon = true;
    menuLinks.push({
      children: (
        <>
          <i className="p-icon--power-off"></i>Turn off
        </>
      ),
      onClick: () => {
        dispatch(machineActions.turnOff(systemId));
        setUpdating(machine.power_state);
      }
    });
  }
  if (powerState !== "unknown") {
    menuLinks.push({
      children: (
        <>
          {hasIcon ? <span className="p-table-menu__icon-space"></span> : null}
          Check power
        </>
      ),
      onClick: () => {
        dispatch(machineActions.checkPower(systemId));
        // Don't display the spinner when checking power as we can't reliably
        // determine that the event has finished.
      }
    });
  }
  if (!hasOnAction && !hasOffAction && powerState === "unknown") {
    menuLinks.push({
      children: "No power actions available",
      disabled: true
    });
  }

  useEffect(() => {
    if (
      updating !== null &&
      (machine.power_state === "error" || machine.power_state !== updating)
    ) {
      setUpdating(null);
    }
  }, [updating, machine.power_state]);

  return (
    <DoubleRow
      icon={
        updating === null ? (
          <i title={powerState} className={iconClass}></i>
        ) : (
          <Loader
            className="u-no-margin u-no-padding--left u-no-padding--right"
            inline
          />
        )
      }
      iconSpace={true}
      menuClassName={hasIcon ? "p-table-menu--hasIcon" : null}
      menuLinks={menuLinks}
      menuTitle="Take action:"
      onToggleMenu={onToggleMenu}
      primary={
        <div className="u-upper-case--first u-truncate" data-test="power_state">
          {powerState}
        </div>
      }
      secondary={
        <div
          className="u-upper-case--first"
          title={machine.power_type}
          data-test="power_type"
        >
          {machine.power_type}
        </div>
      }
    />
  );
};

PowerColumn.propTypes = {
  onToggleMenu: PropTypes.func,
  systemId: PropTypes.string.isRequired
};

export default PowerColumn;
