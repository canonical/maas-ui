import { Button } from "@canonical/react-components";
import classNames from "classnames";
import PropTypes from "prop-types";
import React, { useState } from "react";

import { useOnWindowResize } from "app/base/hooks";

const getParent = (wrapper) => {
  if (!wrapper) {
    return;
  }
  // We want the dimensions of the first child of the contextual menu span, not
  // the span itself. Guard present just in case a child is not defined.
  return wrapper.children.length ? wrapper.children[0] : wrapper;
};

const getParentVisible = (wrapper) => {
  const element = getParent(wrapper);
  return !element || element.offsetParent !== null;
};

const getPositionStyle = (position, wrapper, constrainPanelWidth) => {
  const element = getParent(wrapper);
  if (!element) {
    return;
  }
  const { bottom, left, width } = element.getBoundingClientRect();
  const topPos = bottom + (window.scrollY || 0);
  let leftPos = left;

  switch (position) {
    case "left":
      leftPos = left;
      break;
    case "center":
      leftPos = left + width / 2;
      break;
    case "right":
      leftPos = left + width;
      break;
    default:
      break;
  }

  let styles = { position: "absolute", left: leftPos, top: topPos };

  if (constrainPanelWidth) {
    styles.width = width;
  }

  return styles;
};

const generateLink = (
  { children, className, onClick, ...props },
  key,
  closePortal
) => (
  <Button
    className={classNames("p-contextual-menu__link", className)}
    key={key}
    onClick={
      onClick
        ? (evt) => {
            closePortal();
            onClick(evt);
          }
        : null
    }
    {...props}
  >
    {children}
  </Button>
);

const ContextualMenuDropdown = ({
  closePortal,
  constrainPanelWidth,
  dropdownClassName,
  dropdownContent,
  id,
  isOpen,
  links,
  position,
  positionNode,
  wrapper,
  wrapperClass,
}) => {
  const [positionStyle, setPositionStyle] = useState(
    getPositionStyle(position, positionNode || wrapper, constrainPanelWidth)
  );

  useOnWindowResize(() => {
    if (!getParentVisible(wrapper)) {
      // Hide the menu if the item has become hidden.
      closePortal();
      return;
    }
    const newStyle = getPositionStyle(
      position,
      positionNode || wrapper,
      constrainPanelWidth
    );
    if (newStyle !== positionStyle) {
      setPositionStyle(newStyle);
    }
  });

  return (
    <span className={wrapperClass} style={positionStyle}>
      <span
        className={classNames("p-contextual-menu__dropdown", dropdownClassName)}
        id={id}
        aria-hidden={isOpen ? "false" : "true"}
        aria-label="submenu"
      >
        {dropdownContent
          ? dropdownContent
          : links.map((item, i) => {
              if (Array.isArray(item)) {
                return (
                  <span className="p-contextual-menu__group" key={i}>
                    {item.map((link, j) => generateLink(link, j, closePortal))}
                  </span>
                );
              }
              if (typeof item === "string") {
                return (
                  <div className="p-contextual-menu__non-interactive" key={i}>
                    {item}
                  </div>
                );
              }
              return generateLink(item, i, closePortal);
            })}
      </span>
    </span>
  );
};

ContextualMenuDropdown.propTypes = {
  closePortal: PropTypes.func,
  constrainPanelWidth: PropTypes.bool,
  dropdownClassName: PropTypes.string,
  dropdownContent: PropTypes.node,
  id: PropTypes.string,
  isOpen: PropTypes.bool,
  links: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape(Button.propTypes),
      PropTypes.arrayOf(PropTypes.shape(Button.propTypes)),
    ])
  ),
  position: PropTypes.oneOf(["left", "center", "right"]),
  positionNode: PropTypes.object,
  wrapper: PropTypes.object,
  wrapperClass: PropTypes.string,
};

export default ContextualMenuDropdown;
