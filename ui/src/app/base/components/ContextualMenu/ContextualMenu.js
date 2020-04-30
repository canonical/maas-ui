import { Button } from "@canonical/react-components";
import classNames from "classnames";
import { nanoid } from "@reduxjs/toolkit";
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import usePortal from "react-useportal";

import ContextualMenuDropdown from "./ContextualMenuDropdown";

const ContextualMenu = ({
  className,
  constrainPanelWidth,
  dropdownContent,
  dropdownClassName,
  hasToggleIcon,
  links,
  onToggleMenu,
  position = "right",
  positionNode,
  toggleAppearance,
  toggleClassName,
  toggleDisabled,
  toggleLabel,
  toggleLabelFirst = true,
}) => {
  const id = useRef(nanoid());
  const wrapper = useRef(null);
  const hasToggle = hasToggleIcon || toggleLabel;
  const { openPortal, closePortal, isOpen, Portal } = usePortal({
    isOpen: !hasToggle,
  });
  const labelNode = toggleLabel ? <span>{toggleLabel}</span> : null;
  const wrapperClass = classNames(
    className,
    ["p-contextual-menu", position === "right" ? null : position]
      .filter(Boolean)
      .join("--")
  );

  useEffect(() => {
    onToggleMenu && onToggleMenu(isOpen);
    // onToggleMenu is excluded from the useEffect deps as onToggleMenu gets
    // redefined on a state update which causes an infinite loop here.
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span className={wrapperClass} ref={wrapper}>
      {hasToggle && (
        <Button
          appearance={toggleAppearance}
          aria-controls={id.current}
          aria-expanded={isOpen ? "true" : "false"}
          aria-haspopup="true"
          className={classNames("p-contextual-menu__toggle", toggleClassName)}
          disabled={toggleDisabled}
          hasIcon={hasToggleIcon}
          onClick={(evt) => {
            if (!isOpen) {
              openPortal(evt);
            } else {
              closePortal(evt);
            }
          }}
        >
          {toggleLabelFirst ? labelNode : null}
          {hasToggleIcon ? (
            <i
              className={classNames(
                "p-icon--contextual-menu p-contextual-menu__indicator",
                {
                  "is-light": ["negative", "positive"].includes(
                    toggleAppearance
                  ),
                }
              )}
            ></i>
          ) : null}
          {toggleLabelFirst ? null : labelNode}
        </Button>
      )}
      {isOpen && (
        <Portal>
          <ContextualMenuDropdown
            closePortal={closePortal}
            constrainPanelWidth={constrainPanelWidth}
            dropdownClassName={dropdownClassName}
            dropdownContent={dropdownContent}
            id={id.current}
            isOpen={isOpen}
            links={links}
            position={position}
            positionNode={positionNode ? positionNode.current : null}
            wrapper={wrapper.current}
            wrapperClass={wrapperClass}
          />
        </Portal>
      )}
    </span>
  );
};

ContextualMenu.propTypes = {
  className: PropTypes.string,
  constrainPanelWidth: PropTypes.bool,
  dropdownContent: PropTypes.node,
  hasToggleIcon: PropTypes.bool,
  links: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape(Button.propTypes),
      PropTypes.arrayOf(PropTypes.shape(Button.propTypes)),
    ])
  ),
  onToggleMenu: PropTypes.func,
  positionNode: PropTypes.object,
  position: PropTypes.oneOf(["left", "center", "right"]),
  toggleAppearance: PropTypes.string,
  toggleClassName: PropTypes.string,
  toggleLabel: PropTypes.string,
  toggleLabelFirst: PropTypes.bool,
};

export default ContextualMenu;
