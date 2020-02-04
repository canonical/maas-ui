import { Select } from "@canonical/react-components";
import React from "react";
import PropTypes from "prop-types";

const groupOptions = [
  {
    value: "none",
    label: "No grouping"
  },
  {
    value: "owner",
    label: "Group by owner"
  },
  {
    value: "pool",
    label: "Group by pool"
  },
  {
    value: "power_state",
    label: "Group by power state"
  },
  {
    value: "status",
    label: "Group by status"
  },
  {
    value: "zone",
    label: "Group by zone"
  }
];

const GroupSelect = ({ grouping, setGrouping, setHiddenGroups }) => {
  return (
    <Select
      defaultValue={grouping}
      name="machine-groupings"
      onChange={e => {
        setGrouping(e.target.value);
        setHiddenGroups([]);
      }}
      options={groupOptions}
    />
  );
};

GroupSelect.propTypes = {
  grouping: PropTypes.string.isRequired,
  setGrouping: PropTypes.func.isRequired,
  setHiddenGroups: PropTypes.func.isRequired
};

export default GroupSelect;
