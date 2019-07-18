import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import classNames from "classnames";
import React from "react";
import ReactRouterPropTypes from "react-router-prop-types";

import "./Nav.scss";

function _generateSection(section, location) {
  let subNav = null;
  if (section.subNav && section.subNav.length) {
    const items = section.subNav.map(item => {
      const url = `${section.url}#${item.url}`;
      return (
        <li className="settings-nav__item" key={url}>
          <HashLink to={url} className="p-link--soft">
            {item.label}
          </HashLink>
        </li>
      );
    });
    subNav = <ul className="settings-nav__list">{items}</ul>;
  }
  const isActive = section.url === location.pathname;
  return (
    <li className="settings-nav__item" key={section.url}>
      <strong className={classNames({ "is-active": isActive })}>
        <Link to={section.url} className="p-link--soft">
          {section.label}
        </Link>
      </strong>
      {subNav}
    </li>
  );
}

export const Nav = props => {
  const nav = [
    {
      url: "/general",
      label: "General"
    },
    {
      url: "/settings/users",
      label: "Users",
      subNav: [{ url: "test", label: "Test" }, { url: "test2", label: "Test2" }]
    },
    {
      url: "/settings/repositories",
      label: "Package repos"
    }
  ];
  const sections = nav.map(item => _generateSection(item, props.location));
  return (
    <nav className="settings-nav">
      <ul className="settings-nav__list">{sections}</ul>
    </nav>
  );
};

Nav.propTypes = {
  location: ReactRouterPropTypes.location.isRequired
};

export default withRouter(Nav);
