import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import classNames from "classnames";
import React from "react";
import ReactRouterPropTypes from "react-router-prop-types";

import "./Nav.scss";

const _generateSection = (section, location) => {
  let subNav = null;
  if (section.subNav && section.subNav.length) {
    const items = section.subNav.map(item => {
      const path = `${section.path}/${item.path}`;
      return (
        <li className="settings-nav__item" key={path}>
          <Link to={path} className="p-link--soft">
            {item.label}
          </Link>
        </li>
      );
    });
    subNav = <ul className="settings-nav__list">{items}</ul>;
  }
  const isActive = location.pathname.startsWith(section.path);
  return (
    <li className="settings-nav__item" key={section.path}>
      <strong className={classNames({ "is-active": isActive })}>
        <Link to={section.path} className="p-link--soft">
          {section.label}
        </Link>
      </strong>
      {subNav}
    </li>
  );
};

export const Nav = props => {
  const nav = [
    {
      path: "/configuration",
      label: "Configuration",
      subNav: [
        { path: "general", label: "General" },
        { path: "commissioning", label: "Commissioning" },
        { path: "deploy", label: "Deploy" },
        { path: "kernel-parameters", label: "Kernel parameters" }
      ]
    },
    {
      path: "/users",
      label: "Users"
    },
    {
      path: "/images",
      label: "Images",
      subNav: [
        { path: "ubuntu", label: "Ubuntu" },
        { path: "centos", label: "CentOS" },
        { path: "windows", label: "Windows" },
        { path: "vmware", label: "VMware" }
      ]
    },
    {
      path: "/storage",
      label: "Storage"
    },
    {
      path: "/network",
      label: "Network",
      subNav: [
        { path: "proxy", label: "Proxy" },
        { path: "dns", label: "DNS" },
        { path: "ntp", label: "NTP" },
        { path: "syslog", label: "Syslog" }
      ]
    },
    {
      path: "/scripts",
      label: "Scripts",
      subNav: [
        { path: "user-scripts", label: "User scripts" },
        { path: "built-in-scripts", label: "Built-in scripts" }
      ]
    },
    {
      path: "/dhcp",
      label: "DHCP snippets"
    },
    {
      path: "/repositories",
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
