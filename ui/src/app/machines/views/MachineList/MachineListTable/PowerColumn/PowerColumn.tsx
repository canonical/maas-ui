import { memo, useEffect, useState } from "react";

import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import PowerIcon from "app/base/components/PowerIcon";
import { useToggleMenu } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import { PowerState } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";

type Props = {
  onToggleMenu?: (systemId: Machine["system_id"], open: boolean) => void;
  systemId: Machine["system_id"];
};

export const PowerColumn = ({
  onToggleMenu,
  systemId,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const [updating, setUpdating] = useState<PowerState | null>(null);
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const toggleMenu = useToggleMenu(onToggleMenu, systemId);
  const powerState = machine?.power_state || PowerState.UNKNOWN;

  useEffect(() => {
    if (
      updating !== null &&
      (powerState === PowerState.ERROR || powerState !== updating)
    ) {
      setUpdating(null);
    }
  }, [powerState, updating]);

  if (!machine) {
    return null;
  }

  const menuLinks = [];
  const hasOnAction = machine.actions.includes(NodeActions.ON);
  const hasOffAction = machine.actions.includes(NodeActions.OFF);
  if (hasOnAction && powerState !== PowerState.ON) {
    menuLinks.push({
      children: <PowerIcon powerState={PowerState.ON}>Turn on</PowerIcon>,
      onClick: () => {
        dispatch(machineActions.on(systemId));
        setUpdating(machine.power_state);
      },
    });
  }
  if (hasOffAction && powerState !== PowerState.OFF) {
    menuLinks.push({
      children: <PowerIcon powerState={PowerState.OFF}>Turn off</PowerIcon>,
      onClick: () => {
        dispatch(machineActions.off(systemId));
        setUpdating(machine.power_state);
      },
    });
  }
  if (powerState !== PowerState.UNKNOWN) {
    menuLinks.push({
      children: (
        <>
          <span className="p-table-menu__icon-space"></span>
          Check power
        </>
      ),
      onClick: () => {
        dispatch(machineActions.checkPower(systemId));
        // Don't display the spinner when checking power as we can't reliably
        // determine that the event has finished.
      },
    });
  }
  if (!hasOnAction && !hasOffAction && powerState === PowerState.UNKNOWN) {
    menuLinks.push({
      children: "No power actions available",
      disabled: true,
    });
  }

  return (
    <DoubleRow
      icon={
        <PowerIcon powerState={powerState} showSpinner={updating !== null} />
      }
      iconSpace={true}
      menuClassName="p-table-menu--hasIcon"
      menuLinks={onToggleMenu && menuLinks}
      menuTitle="Take action:"
      onToggleMenu={toggleMenu}
      primary={
        <div className="u-upper-case--first u-truncate" data-test="power_state">
          {powerState}
        </div>
      }
      primaryTitle={powerState}
      secondary={
        <div
          className="u-upper-case--first"
          title={machine.power_type}
          data-test="power_type"
        >
          {machine.power_type}
        </div>
      }
      secondaryTitle={machine.power_type}
    />
  );
};

PowerColumn.propTypes = {
  onToggleMenu: PropTypes.func,
  systemId: PropTypes.string.isRequired,
};

export default memo(PowerColumn);
