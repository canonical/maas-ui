import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";

import classNames from "classnames";
import type { Location } from "history";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom-v5-compat";

import { useCycled } from "app/base/hooks";

export type SubNav = {
  label: string;
  path: string;
};

export type NavItem = {
  label: string;
  path?: string;
  subNav?: SubNav[];
};

type Props = {
  closeToggleText?: ReactNode;
  items: NavItem[];
  openToggleText?: ReactNode;
};

const _generateSection = (
  section: NavItem,
  location: Location,
  closeDrawer: () => void
) => {
  let subNav = null;

  if (section.subNav && section.subNav.length) {
    const subsections = section.subNav.map((subsection) => {
      const subPath = subsection.path;
      const isActive = location.pathname === subPath;
      return (
        <li className="p-side-navigation__item" key={subPath}>
          <Link
            className={classNames("p-side-navigation__link", {
              "is-active": isActive,
            })}
            onClick={closeDrawer}
            to={subPath}
          >
            {subsection.label}
          </Link>
        </li>
      );
    });
    subNav = <ul className="p-side-navigation__list">{subsections}</ul>;
  }

  if (section.path) {
    const path = section.path;
    let isActive;
    if (!section.subNav) {
      isActive = location.pathname.startsWith(path);
    } else {
      isActive = location.pathname === path;
    }
    return (
      <li className="p-side-navigation__item--title" key={path}>
        <Link
          className={classNames("p-side-navigation__link", {
            "is-active": isActive,
          })}
          onClick={closeDrawer}
          to={path}
        >
          {section.label}
        </Link>
        {subNav}
      </li>
    );
  }

  return (
    <li className="p-side-navigation__item--title" key={section.label}>
      <span className="p-side-navigation__text p-side-navigation__item">
        {section.label}
      </span>
      {subNav}
    </li>
  );
};

// eslint-disable-next-line react/no-multi-comp
export const SideNav = ({
  closeToggleText = "Toggle side navigation",
  items,
  openToggleText = "Toggle side navigation",
}: Props): JSX.Element => {
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const [hasExpanded] = useCycled(!isDrawerExpanded);
  const location = useLocation();
  const handleEscapeKey = useCallback((e) => {
    if (e.key === "Escape") {
      setIsDrawerExpanded(false);
    }
  }, []);
  const sections = items.map((item) =>
    _generateSection(item, location, () => setIsDrawerExpanded(false))
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscapeKey, false);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey, false);
    };
  }, [handleEscapeKey]);

  return (
    <nav
      className={classNames("p-side-navigation", {
        // We only set the collapsed class if the sidenav has expanded at least
        // once, otherwise the closing animation plays on load.
        "is-collapsed": !isDrawerExpanded && hasExpanded,
        "is-expanded": isDrawerExpanded,
      })}
    >
      <button
        aria-controls="side-navigation-drawer"
        aria-expanded={isDrawerExpanded}
        className="p-side-navigation__toggle"
        data-testid="sidenav-toggle-open"
        onClick={() => setIsDrawerExpanded(true)}
      >
        {openToggleText}
      </button>
      <div
        aria-controls="side-navigation-drawer"
        aria-expanded={isDrawerExpanded}
        className="p-side-navigation__overlay"
        onClick={() => setIsDrawerExpanded(false)}
      />
      <div className="p-side-navigation__drawer">
        <div className="p-navigation__drawer-header">
          <button
            aria-controls="side-navigation-drawer"
            aria-expanded={isDrawerExpanded}
            className="p-side-navigation__toggle--in-drawer"
            data-testid="sidenav-toggle-close"
            onClick={() => setIsDrawerExpanded(false)}
          >
            {closeToggleText}
          </button>
        </div>
        <ul className="p-side-navigation__list">{sections}</ul>
      </div>
    </nav>
  );
};

export default SideNav;
