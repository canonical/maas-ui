import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import type { GenerateNavLink, NavItem, ToggleVisible } from "../types";

type Props = {
  generateLink: GenerateNavLink;
  links: NavItem[];
  toggleHardwareMenu: ToggleVisible;
};

export const HardwareMenu = ({
  generateLink,
  links,
  toggleHardwareMenu,
}: Props) => {
  const wrapperRef = useRef(null);
  const handleClickOutsideRef = useRef(null);

  useEffect(() => {
    if (handleClickOutsideRef.current) {
      // Clean up the previous listener.
      document.removeEventListener(
        "click",
        handleClickOutsideRef.current,
        true
      );
    }
    handleClickOutsideRef.current = (event: React.MouseEvent<HTMLElement>) => {
      // The target might be something like an SVG node which doesn't provide
      // the class name as a string.
      const isValidTarget =
        typeof (event?.target as HTMLElement)?.className === "string";
      if (
        !isValidTarget ||
        (wrapperRef.current &&
          !wrapperRef.current.contains(event.target) &&
          !(event.target as HTMLElement).className.includes(
            "hardware-menu__toggle"
          ))
      ) {
        toggleHardwareMenu(event);
      }
    };
    document.addEventListener("click", handleClickOutsideRef.current, true);
    return () => {
      // Remove the listener when the component is unmounted.
      document.removeEventListener(
        "click",
        handleClickOutsideRef.current,
        true
      );
    };
  }, [toggleHardwareMenu]);

  return (
    <ul className="p-subnav__items" ref={wrapperRef}>
      {links.map((link: NavItem) => (
        // eslint-disable-next-line
        <li
          key={link.url}
          onClick={(event) => {
            toggleHardwareMenu(event, false);
          }}
        >
          {generateLink(link, "p-subnav__item")}
        </li>
      ))}
    </ul>
  );
};

HardwareMenu.propTypes = {
  generateLink: PropTypes.func.isRequired,
  links: PropTypes.array.isRequired,
  toggleHardwareMenu: PropTypes.func.isRequired,
};

export default HardwareMenu;
