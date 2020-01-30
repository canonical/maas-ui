import { Button } from "@canonical/react-components";
import classNames from "classnames";
import nanoid from "nanoid";
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import usePortal from "react-useportal";

const getPositionStyle = (position, wrapper) => {
  if (!wrapper || !wrapper.current) {
    return undefined;
  }

  const dimensions = wrapper.current.getBoundingClientRect();
  const { x, y, height, width } = dimensions;
  let left = x + window.scrollX || 0;
  let top = y + window.scrollY || 0;
  let right = "auto";
  top += height;

  switch (position) {
    case "center":
      left += width / 2;
      break;
    case "left":
      break;
    case "right":
      right = (window.innerWidth || 0) - left - width;
      left = "auto";
      break;
    default:
      break;
  }

  return { position: "absolute", left, right, top };
};

const generateLink = ({ children, className, ...props }, key) => (
  <Button
    className={classNames("p-contextual-menu__link", className)}
    key={key}
    {...props}
  >
    {children}
  </Button>
);

const ContextualMenu = ({
  className,
  hasToggleIcon,
  links,
  onToggleMenu,
  position = "right",
  toggleAppearance,
  toggleClassName,
  toggleLabel,
  toggleLabelFirst = true
}) => {
  const id = useRef(nanoid());
  const wrapper = useRef(null);
  const positionStyle = useRef(null);
  const hasToggle = hasToggleIcon || toggleLabel;
  const { openPortal, closePortal, isOpen, Portal } = usePortal({
    isOpen: !hasToggle
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

  // Only update the styles when the toggle is visible otherwise subsequent
  // rerenders can result in a race condition while the toggle is hidden.
  useEffect(() => {
    if (isOpen) {
      let style;
      if (wrapper && wrapper.current) {
        style = window.getComputedStyle(wrapper.current);
      }
      if (style && style.display !== "none") {
        positionStyle.current = getPositionStyle(position, wrapper);
      }
    }
  }, [isOpen, position]);

  return (
    <span className={wrapperClass} ref={wrapper}>
      {hasToggle ? (
        <Button
          appearance={toggleAppearance}
          aria-controls={id.current}
          aria-expanded={isOpen ? "true" : "false"}
          aria-haspopup="true"
          className={classNames("p-contextual-menu__toggle", toggleClassName)}
          hasIcon={hasToggleIcon}
          onClick={evt => {
            if (!isOpen) {
              openPortal(evt);
            } else {
              closePortal(evt);
            }
          }}
        >
          {toggleLabelFirst ? labelNode : null}
          {hasToggleIcon ? (
            <i className="p-icon--contextual-menu p-contextual-menu__indicator"></i>
          ) : null}
          {toggleLabelFirst ? null : labelNode}
        </Button>
      ) : null}
      {isOpen && (
        <Portal>
          <span className={wrapperClass} style={positionStyle.current}>
            <span
              className="p-contextual-menu__dropdown"
              id={id.current}
              aria-hidden={isOpen ? "false" : "true"}
              aria-label="submenu"
            >
              {links.map((item, i) => {
                if (Array.isArray(item)) {
                  return (
                    <span className="p-contextual-menu__group" key={i}>
                      {item.map(generateLink)}
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
                return generateLink(item, i);
              })}
            </span>
          </span>
        </Portal>
      )}
    </span>
  );
};

ContextualMenu.propTypes = {
  className: PropTypes.string,
  hasToggleIcon: PropTypes.bool,
  links: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape(Button.propTypes),
      PropTypes.arrayOf(PropTypes.shape(Button.propTypes))
    ])
  ).isRequired,
  onToggleMenu: PropTypes.func,
  position: PropTypes.oneOf(["left", "center", "right"]),
  toggleAppearance: PropTypes.string,
  toggleClassName: PropTypes.string,
  toggleLabel: PropTypes.string,
  toggleLabelFirst: PropTypes.bool
};

export default ContextualMenu;
