import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import "./ColumnToggle.scss";
import { Button } from "@canonical/react-components";

const ColumnToggle = ({ isExpanded, label, onClose, onOpen }) => (
  <Button
    appearance="link"
    className={classNames("column-toggle", {
      "is-active": isExpanded
    })}
    inline
    onClick={() => {
      if (isExpanded) {
        onClose();
      } else {
        onOpen();
      }
    }}
  >
    <span className="column-toggle__name">{label}</span>
  </Button>
);

ColumnToggle.propTypes = {
  isExpanded: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired
};

export default ColumnToggle;
