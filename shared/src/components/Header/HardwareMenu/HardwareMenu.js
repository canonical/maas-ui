import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";

export const HardwareMenu = ({ generateLink, links, toggleHardwareMenu }) => {
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
    handleClickOutsideRef.current = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        !event.target.className.includes("hardware-menu")
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
      {links.map((link) => (
        // eslint-disable-next-line
        <li
          key={link.url}
          onClick={(event) => {
            toggleHardwareMenu(event, false);
          }}
        >
          {generateLink(link, "p-subnav__item", toggleHardwareMenu)}
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
