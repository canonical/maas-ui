import { Spinner, Tooltip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";

import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import { NodeActions } from "app/store/types/node";
import zoneSelectors from "app/store/zone/selectors";
import { useToggleMenu } from "app/machines/hooks";
import DoubleRow from "app/base/components/DoubleRow";
import LegacyLink from "app/base/components/LegacyLink";

const getSpaces = (machine) => {
  if (machine.spaces.length > 1) {
    const sorted = [...machine.spaces].sort();
    return (
      <Tooltip position="btm-left" message={sorted.join("\n")}>
        <span data-test="spaces">{`${machine.spaces.length} spaces`}</span>
      </Tooltip>
    );
  }
  return (
    <span data-test="spaces" title={machine.spaces[0]}>
      {machine.spaces[0]}
    </span>
  );
};

export const ZoneColumn = ({ onToggleMenu, systemId }) => {
  const dispatch = useDispatch();
  const [updating, setUpdating] = useState(null);
  const machine = useSelector((state) =>
    machineSelectors.getById(state, systemId)
  );
  const zones = useSelector(zoneSelectors.all);
  const toggleMenu = useToggleMenu(onToggleMenu, systemId);
  let zoneLinks = zones.filter((zone) => zone.id !== machine.zone.id);
  if (machine.actions.includes(NodeActions.SET_ZONE)) {
    if (zoneLinks.length !== 0) {
      zoneLinks = zoneLinks.map((zone) => ({
        children: zone.name,
        onClick: () => {
          dispatch(machineActions.setZone(systemId, zone.id));
          setUpdating(zone.id);
        },
      }));
    } else {
      zoneLinks = [{ children: "No other zones available", disabled: true }];
    }
  } else {
    zoneLinks = [
      { children: "Cannot change zone of this machine", disabled: true },
    ];
  }

  useEffect(() => {
    if (updating !== null && machine.zone.id === updating) {
      setUpdating(null);
    }
  }, [updating, machine.zone.id]);

  return (
    <DoubleRow
      menuLinks={onToggleMenu && zoneLinks}
      menuTitle="Change AZ:"
      onToggleMenu={toggleMenu}
      primary={
        <span data-test="zone">
          {updating !== null ? (
            <Spinner className="u-nudge-left--small" />
          ) : null}
          <LegacyLink
            className="p-link--soft"
            route={`/zone/${machine.zone.id}`}
          >
            {machine.zone.name}
          </LegacyLink>
        </span>
      }
      primaryTitle={machine.zone.name}
      secondary={getSpaces(machine)}
    />
  );
};

ZoneColumn.propTypes = {
  onToggleMenu: PropTypes.func,
  systemId: PropTypes.string.isRequired,
};

export default memo(ZoneColumn);
