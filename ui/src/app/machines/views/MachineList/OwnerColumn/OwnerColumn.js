import { useSelector } from "react-redux";
import React from "react";
import PropTypes from "prop-types";

import { machine as machineSelectors } from "app/base/selectors";
import DoubleRow from "app/base/components/DoubleRow";

const OwnerColumn = ({ onToggleMenu, systemId }) => {
  const machine = useSelector(state =>
    machineSelectors.getBySystemId(state, systemId)
  );

  const owner = machine.owner ? machine.owner : "-";
  const tags = machine.tags ? machine.tags.join(", ") : "";

  return (
    <DoubleRow
      menuLinks={[{ children: "Link1" }, { children: "Link2" }]}
      menuTitle="Take action:"
      onToggleMenu={onToggleMenu}
      primary={<span data-test="owner">{owner}</span>}
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
