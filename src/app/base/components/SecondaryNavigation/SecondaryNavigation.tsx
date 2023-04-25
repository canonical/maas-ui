/* eslint-disable react/no-multi-comp */
import classNames from "classnames";
import type { Location } from "react-router-dom-v5-compat";
import { Link, matchPath, useLocation } from "react-router-dom-v5-compat";

import settingsURLs from "app/settings/urls";

export type NavItem = {
  label: string;
  path?: string;
  items?: NavItem[];
};

type ItemProps = { item: NavItem };

const SideNavigationLink = ({ item }: ItemProps) => {
  const location = useLocation();
  const isActive = getIsActive({ item, location });
  if (!item.path) {
    return null;
  }
  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={classNames("p-side-navigation__link", {
        "is-active": isActive,
      })}
      to={item.path}
    >
      {item.label}
    </Link>
  );
};

const SubNavItem = ({ item }: ItemProps) => {
  return (
    <li className="p-side-navigation__item" key={item.path}>
      <SideNavigationLink item={item} />
    </li>
  );
};

const SubNavigation = ({ items }: { items: NavItem["items"] }) => {
  if (!items || !items.length) return null;

  return (
    <ul className="p-side-navigation__list">
      {items.map((item) => (
        <SubNavItem item={item} key={item.path} />
      ))}
    </ul>
  );
};

const getIsActive = ({
  item,
  location,
}: ItemProps & { location: Location }) => {
  const path = item.path;

  if (!path) {
    return false;
  }

  if (!item.items) {
    return location.pathname.startsWith(path);
  }

  return matchPath(path, location.pathname);
};

const SideNavigationItem = ({ item }: ItemProps) => {
  const location = useLocation();
  const isActive = getIsActive({ item, location });
  const itemClassName = classNames("p-side-navigation__item--title", {
    "is-active": isActive,
  });

  return (
    <li className={itemClassName} key={item.path || item.label}>
      {item.path ? (
        <SideNavigationLink item={item} />
      ) : (
        <span className="p-side-navigation__text p-side-navigation__item">
          {item.label}
        </span>
      )}
      {item.items ? <SubNavigation items={item.items} /> : null}
    </li>
  );
};

export const secondaryNavItems: NavItem[] = [
  {
    label: "Configuration",
    items: [
      { path: settingsURLs.configuration.general, label: "General" },
      {
        path: settingsURLs.configuration.commissioning,
        label: "Commissioning",
      },
      { path: settingsURLs.configuration.deploy, label: "Deploy" },
      {
        path: settingsURLs.configuration.kernelParameters,
        label: "Kernel parameters",
      },
    ],
  },
  {
    label: "Security",
    items: [
      {
        path: settingsURLs.security.securityProtocols,
        label: "Security protocols",
      },
      {
        path: settingsURLs.security.secretStorage,
        label: "Secret storage",
      },
      {
        path: settingsURLs.security.sessionTimeout,
        label: "Session timeout",
      },
      {
        path: settingsURLs.security.ipmiSettings,
        label: "IPMI settings",
      },
    ],
  },
  {
    path: settingsURLs.users.index,
    label: "Users",
  },
  {
    label: "Images",
    items: [
      { path: settingsURLs.images.ubuntu, label: "Ubuntu" },
      { path: settingsURLs.images.windows, label: "Windows" },
      { path: settingsURLs.images.vmware, label: "VMware" },
    ],
  },
  {
    path: settingsURLs.licenseKeys.index,
    label: "License keys",
  },
  {
    path: settingsURLs.storage,
    label: "Storage",
  },
  {
    label: "Network",
    items: [
      { path: settingsURLs.network.proxy, label: "Proxy" },
      { path: settingsURLs.network.dns, label: "DNS" },
      { path: settingsURLs.network.ntp, label: "NTP" },
      { path: settingsURLs.network.syslog, label: "Syslog" },
      {
        path: settingsURLs.network.networkDiscovery,
        label: "Network discovery",
      },
    ],
  },
  {
    label: "Scripts",
    items: [
      {
        path: settingsURLs.scripts.commissioning.index,
        label: "Commissioning scripts",
      },
      {
        path: settingsURLs.scripts.testing.index,
        label: "Testing scripts",
      },
    ],
  },
  {
    path: settingsURLs.dhcp.index,
    label: "DHCP snippets",
  },
  {
    path: settingsURLs.repositories.index,
    label: "Package repos",
  },
];

export const SecondaryNavigation = ({
  isOpen,
}: {
  isOpen?: boolean;
}): JSX.Element => {
  return (
    <div
      className={classNames("p-side-navigation is-maas is-dark", {
        "is-open": isOpen,
      })}
    >
      <nav className="p-side-navigation__drawer u-padding-top--medium">
        <h2 className="p-side-navigation__title p-heading--4 p-panel__logo-name">
          Settings
        </h2>
        <ul className="p-side-navigation__list">
          {secondaryNavItems.map((item) => (
            <SideNavigationItem item={item} key={item.label} />
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SecondaryNavigation;
