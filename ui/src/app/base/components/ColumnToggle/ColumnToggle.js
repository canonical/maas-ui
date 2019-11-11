import { Button } from "@canonical/react-components";
import classNames from "classnames";
import PropTypes from "prop-types";
import React, { useRef } from "react";

import "./ColumnToggle.scss";

const ColumnToggle = ({ isExpanded, label, onClose, onOpen }) => {
  const buttonNode = useRef(null);
  return (
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
          // Delay the scroll check until the toggle is complete.
          window.requestAnimationFrame(() => {
            const { top } = buttonNode.current.getBoundingClientRect();
            // When a section opens check that it does not get moved off screen,
            // and if it does, scroll it into view.
            if (window.scrollY + top < window.scrollY) {
              window.scrollTo(0, window.scrollY + top);
            }
          });
        }
      }}
    >
      <span className="column-toggle__name" ref={buttonNode}>
        {label}
      </span>
    </Button>
  );
};

ColumnToggle.propTypes = {
  isExpanded: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired
};

export default ColumnToggle;
