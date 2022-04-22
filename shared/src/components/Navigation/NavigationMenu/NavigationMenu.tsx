import type { HTMLProps } from "react";
import React, { useCallback, useState } from "react";

import type { PropsWithSpread } from "@canonical/react-components";
import classNames from "classnames";

import { useClickOutside } from "../../../utils";
import NavigationLink from "../NavigationLink";
import type { GenerateLink, NavMenu } from "../types";

type Props = PropsWithSpread<
  NavMenu & {
    generateLink?: GenerateLink;
  },
  HTMLProps<HTMLLIElement>
>;

/**
 * This component is used internally to display menus inside the Navigation component.
 */
const NavigationMenu = ({
  alignRight,
  generateLink,
  items,
  label,
  ...props
}: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = useCallback(() => setIsOpen(false), [setIsOpen]);
  const [menuRef, menuId] = useClickOutside<HTMLButtonElement>(closeMenu);
  return (
    <li
      {...props}
      className={classNames(
        props.className,
        "p-navigation__item--dropdown-toggle",
        {
          "is-active": isOpen,
        }
      )}
    >
      <button
        aria-controls={menuId}
        className="p-navigation__link u-no-margin--right"
        onClick={(evt) => {
          evt.preventDefault();
          setIsOpen(!isOpen);
        }}
        ref={menuRef}
      >
        {label}
      </button>
      <ul
        aria-hidden={!isOpen}
        className={classNames("p-navigation__dropdown", {
          "p-navigation__dropdown--right": alignRight,
        })}
        id={menuId}
      >
        {items.map((item) => (
          <li key={item.url}>
            <NavigationLink
              {...item}
              generateLink={generateLink}
              className={classNames(
                "p-navigation__dropdown-item",
                item.className
              )}
            />
          </li>
        ))}
      </ul>
    </li>
  );
};

export default NavigationMenu;
