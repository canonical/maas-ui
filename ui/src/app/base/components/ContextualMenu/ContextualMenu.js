import { Button } from "@canonical/react-components";
import classNames from "classnames";
import nanoid from "nanoid";
import PropTypes from "prop-types";
import React, { useRef } from "react";
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
  position = "right",
  toggleAppearance,
  toggleLabel,
  toggleLabelFirst = true
}) => {
  const id = useRef(nanoid());
  const wrapper = useRef(null);
  const hasToggle = hasToggleIcon || toggleLabel;
  const { openPortal, closePortal, isOpen, Portal } = usePortal({
    isOpen: !hasToggle
  });
  const positionStyle = getPositionStyle(position, wrapper);
  const labelNode = toggleLabel ? <span>{toggleLabel}</span> : null;
  const wrapperClass = classNames(
    className,
    ["p-contextual-menu", position === "right" ? null : position]
      .filter(Boolean)
      .join("--")
  );
  return (
    <span className={wrapperClass} ref={wrapper}>
      {hasToggle ? (
        <Button
          appearance={toggleAppearance}
          aria-controls={id.current}
          aria-expanded={isOpen ? "true" : "false"}
          aria-haspopup="true"
          className="p-contextual-menu__toggle"
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
          <span className={wrapperClass} style={positionStyle}>
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
  position: PropTypes.oneOf(["left", "center", "right"]),
  toggleAppearance: PropTypes.string,
  toggleLabel: PropTypes.string,
  toggleLabelFirst: PropTypes.bool
};

export default ContextualMenu;
