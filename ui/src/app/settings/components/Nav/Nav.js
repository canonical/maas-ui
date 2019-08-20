import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import classNames from "classnames";
import React from "react";
import ReactRouterPropTypes from "react-router-prop-types";

import "./Nav.scss";

const _generateSection = (section, location) => {
  let subNav = null;

  if (section.subNav && section.subNav.length) {
    const subsections = section.subNav.map(subsection => {
      const isActive = location.pathname === subsection.path;
      return (
        <li className="settings-nav__item" key={subsection.path}>
          <Link
            to={subsection.path}
            className={classNames("p-link--soft", { "is-active": isActive })}
          >
            {subsection.label}
          </Link>
        </li>
      );
    });
    subNav = <ul className="settings-nav__list">{subsections}</ul>;
  }

  if (section.path) {
    let isActive;
    if (!section.subNav) {
      isActive = location.pathname.startsWith(section.path);
    } else {
      isActive = location.pathname === section.path;
    }
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
  }

  return (
    <li className="settings-nav__item" key={section.label}>
      <strong>{section.label}</strong>
      {subNav}
    </li>
  );
};

export const Nav = props => {
  const nav = [
    {
      label: "Configuration",
      subNav: [
        { path: "/configuration/general", label: "General" },
        { path: "/configuration/commissioning", label: "Commissioning" },
        { path: "/configuration/deploy", label: "Deploy" },
        { path: "/configuration/kernel-parameters", label: "Kernel parameters" }
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
      label: "Network",
      subNav: [
        { path: "/network/proxy", label: "Proxy" },
        { path: "/network/dns", label: "DNS" },
        { path: "/network/ntp", label: "NTP" },
        { path: "/network/syslog", label: "Syslog" },
        { path: "/network/network-discovery", label: "Network discovery" }
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
