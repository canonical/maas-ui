import { Loader } from "@canonical/react-components";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { machine as machineSelectors } from "app/base/selectors";
import { useMachineActions } from "app/base/hooks";
import DoubleRow from "app/base/components/DoubleRow";

const OwnerColumn = ({ onToggleMenu, systemId }) => {
  const [updating, setUpdating] = useState(null);
  const machine = useSelector(state =>
    machineSelectors.getBySystemId(state, systemId)
  );

  const owner = machine.owner ? machine.owner : "-";
  const tags = machine.tags ? machine.tags.join(", ") : "";

  const menuLinks = useMachineActions(
    systemId,
    ["acquire", "release"],
    "No owner actions available",
    () => {
      setUpdating(machine.status);
    }
  );

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
