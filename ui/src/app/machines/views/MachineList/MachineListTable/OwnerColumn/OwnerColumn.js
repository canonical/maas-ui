import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { machine as machineSelectors } from "app/base/selectors";
import { useMachineActions } from "app/base/hooks";
import { useToggleMenu } from "app/machines/hooks";
import DoubleRow from "app/base/components/DoubleRow";

export const OwnerColumn = ({ onToggleMenu, systemId }) => {
  const [updating, setUpdating] = useState(null);
  const machine = useSelector((state) =>
    machineSelectors.getBySystemId(state, systemId)
  );
  const toggleMenu = useToggleMenu(onToggleMenu, systemId);

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
      onToggleMenu={toggleMenu}
      primary={
        <>
          {updating === null ? null : (
            <Spinner className="u-no-margin u-no-padding--left" inline />
          )}
          <span data-test="owner">{owner}</span>
        </>
      }
      primaryTitle={owner}
      secondary={
        <span title={tags} data-test="tags">
          {tags}
        </span>
      }
      secondaryTitle={tags}
    />
  );
};

OwnerColumn.propTypes = {
  onToggleMenu: PropTypes.func.isRequired,
  systemId: PropTypes.string.isRequired,
};

export default React.memo(OwnerColumn);
