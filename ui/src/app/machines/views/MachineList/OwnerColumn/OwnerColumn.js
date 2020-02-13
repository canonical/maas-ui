import { Loader } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { machine as machineActions } from "app/base/actions";
import { machine as machineSelectors } from "app/base/selectors";
import DoubleRow from "app/base/components/DoubleRow";

const OwnerColumn = ({ onToggleMenu, systemId }) => {
  const dispatch = useDispatch();
  const [updating, setUpdating] = useState(null);
  const machine = useSelector(state =>
    machineSelectors.getBySystemId(state, systemId)
  );

  const owner = machine.owner ? machine.owner : "-";
  const tags = machine.tags ? machine.tags.join(", ") : "";
  const hasAcquireAction = machine.actions.includes("acquire");
  const hasReleaseAction = machine.actions.includes("release");
  let menuLinks = [];
  if (hasAcquireAction) {
    menuLinks.push({
      children: "Acquire...",
      onClick: () => {
        dispatch(machineActions.acquire(systemId));
        setUpdating(machine.status);
      }
    });
  }
  if (hasReleaseAction) {
    menuLinks.push({
      children: "Release...",
      onClick: () => {
        dispatch(machineActions.release(systemId));
        setUpdating(machine.status);
      }
    });
  }
  if (!hasAcquireAction && !hasReleaseAction) {
    menuLinks.push({
      children: "No owner actions available",
      disabled: true
    });
  }

  useEffect(() => {
    if (updating !== null && machine.status !== updating) {
      setUpdating(null);
    }
  }, [updating, machine.status]);

  return (
    <DoubleRow
      menuLinks={menuLinks}
      menuTitle="Take action:"
      onToggleMenu={onToggleMenu}
      primary={
        <>
          {updating === null ? null : (
            <Loader className="u-no-margin u-no-padding--left" inline />
          )}
          <span data-test="owner">{owner}</span>
        </>
      }
      secondary={
        <span title={tags} data-test="tags">
          {tags}
        </span>
      }
    />
  );
};

OwnerColumn.propTypes = {
  onToggleMenu: PropTypes.func,
  systemId: PropTypes.string.isRequired
};

export default OwnerColumn;
