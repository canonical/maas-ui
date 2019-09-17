import { Link } from "react-router-dom";
import classNames from "classnames";
import React from "react";

import "./Nav.scss";
import { useLocation, useRouter } from "app/base/hooks";

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

export const Nav = () => {
  const { match } = useRouter();
  const { location } = useLocation();
  const nav = [
    {
      label: "Configuration",
      subNav: [
        { path: `${match.url}/configuration/general`, label: "General" },
        {
          path: `${match.url}/configuration/commissioning`,
          label: "Commissioning"
        },
        { path: `${match.url}/configuration/deploy`, label: "Deploy" },
        {
          path: `${match.url}/configuration/kernel-parameters`,
          label: "Kernel parameters"
        }
      ]
    },
    {
      path: `${match.url}/users`,
      label: "Users"
    },
    {
      label: "Images",
      subNav: [
        { path: `${match.url}/images/ubuntu`, label: "Ubuntu" },
        { path: `${match.url}/images/windows`, label: "Windows" },
        { path: `${match.url}/images/vmware`, label: "VMware" }
      ]
    },
    {
      path: `${match.url}/storage`,
      label: "Storage"
    },
    {
      label: "Network",
      subNav: [
        { path: `${match.url}/network/proxy`, label: "Proxy" },
        { path: `${match.url}/network/dns`, label: "DNS" },
        { path: `${match.url}/network/ntp`, label: "NTP" },
        { path: `${match.url}/network/syslog`, label: "Syslog" },
        {
          path: `${match.url}/network/network-discovery`,
          label: "Network discovery"
        }
      ]
    },
    {
      label: "Scripts",
      subNav: [
        {
          path: `${match.url}/scripts/commissioning`,
          label: "Commissioning scripts"
        },
        { path: `${match.url}/scripts/testing`, label: "Testing scripts" }
      ]
    },
    {
      path: `${match.url}/dhcp`,
      label: "DHCP snippets"
    },
    {
      path: `${match.url}/repositories`,
      label: "Package repos"
    }
  ];
  const sections = nav.map(item => _generateSection(item, location));
  return (
    <nav className="settings-nav">
      <ul className="settings-nav__list">{sections}</ul>
    </nav>
  );
};

export default Nav;
