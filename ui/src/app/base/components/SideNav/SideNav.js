import { Link } from "react-router-dom";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import "./SideNav.scss";
import { useLocation, useRouter } from "app/base/hooks";

const _generateSection = (section, location, match) => {
  let subNav = null;

  if (section.subNav && section.subNav.length) {
    const subsections = section.subNav.map(subsection => {
      const subPath = `${match.url}/${subsection.path}`;
      const isActive = location.pathname === subPath;
      return (
        <li className="side-nav__item" key={subPath}>
          <Link
            to={subPath}
            className={classNames("p-link--soft", { "is-active": isActive })}
          >
            {subsection.label}
          </Link>
        </li>
      );
    });
    subNav = <ul className="side-nav__list">{subsections}</ul>;
  }

  if (section.path) {
    const path = `${match.url}/${section.path}`;
    let isActive;
    if (!section.subNav) {
      isActive = location.pathname.startsWith(path);
    } else {
      isActive = location.pathname === path;
    }
    return (
      <li className="side-nav__item" key={path}>
        <strong className={classNames({ "is-active": isActive })}>
          <Link to={path} className="p-link--soft">
            {section.label}
          </Link>
        </strong>
        {subNav}
      </li>
    );
  }

  return (
    <li className="side-nav__item" key={section.label}>
      <strong>{section.label}</strong>
      {subNav}
    </li>
  );
};

export const SideNav = ({ items }) => {
  const { match } = useRouter();
  const { location } = useLocation();
  const sections = items.map(item => _generateSection(item, location, match));
  return (
    <nav className="side-nav">
      <ul className="side-nav__list">{sections}</ul>
    </nav>
  );
};

SideNav.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string,
      subNav: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          path: PropTypes.string.isRequired
        })
      )
    })
  ).isRequired
};

export default SideNav;
