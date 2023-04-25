import type { ReactNode } from "react";

import { Icon } from "@canonical/react-components";
import { Link } from "react-router-dom-v5-compat";

import type { NavItem } from "../types";
import { isSelected } from "../utils";

import { useId } from "app/base/hooks/base";

type Props = {
  navLink: NavItem;
  icon?: string | ReactNode;
  path: string;
};

export const AppSideNavItem = ({ navLink, icon, path }: Props): JSX.Element => {
  const id = useId();
  return (
    <li
      aria-labelledby={`${navLink.label}-${id}`}
      className={`p-side-navigation__item${
        isSelected(path, navLink) ? " is-selected" : ""
      }`}
    >
      <Link
        aria-current={isSelected(path, navLink) ? "page" : undefined}
        className="p-side-navigation__link"
        id={`${navLink.label}-${id}`}
        onClick={(event) => {
          // removing the focus from the link element after click
          // this allows the side navigation to collapse on mouseleave
          event.currentTarget.blur();
        }}
        to={navLink.url}
      >
        {icon ? (
          typeof icon === "string" ? (
            <Icon className="p-side-navigation__icon" light name={icon} />
          ) : (
            <>{icon}</>
          )
        ) : null}
        <span className="p-side-navigation__label">{navLink.label}</span>
      </Link>
    </li>
  );
};

export default AppSideNavItem;
