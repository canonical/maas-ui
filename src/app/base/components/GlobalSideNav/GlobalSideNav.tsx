import { useEffect, useContext, useState } from "react";

import { Button, ContextualMenu, Icon } from "@canonical/react-components";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useNavigate,
  useLocation,
  useMatch,
} from "react-router-dom-v5-compat";

import NavigationBanner from "./NavigationBanner";
import type { NavGroup } from "./types";
import { isSelected } from "./utils";

import {
  useCompletedIntro,
  useCompletedUserIntro,
  useGoogleAnalytics,
} from "app/base/hooks";
import ThemePreviewContext from "app/base/theme-preview-context";
import urls from "app/base/urls";
import authSelectors from "app/store/auth/selectors";
import configSelectors from "app/store/config/selectors";
import { actions as controllerActions } from "app/store/controller";
import controllerSelectors from "app/store/controller/selectors";
import { version as versionSelectors } from "app/store/general/selectors";
import type { RootState } from "app/store/root/types";
import { actions as statusActions } from "app/store/status";
import type { User } from "app/store/user/types";

const navGroups: NavGroup[] = [
  {
    navLinks: [
      {
        label: "Images",
        url: urls.images.index,
      },
      {
        highlight: [urls.tags.index, urls.tags.tag.index(null)],
        label: "Tags",
        url: urls.tags.index,
      },
      {
        highlight: [urls.zones.index, urls.zones.details(null)],
        label: "AZs",
        url: urls.zones.index,
      },
      {
        label: "Pools",
        url: urls.pools.index,
      },
    ],
  },
  {
    groupTitle: "Hardware",
    groupIcon: "machines-light",
    navLinks: [
      {
        highlight: [urls.machines.index, urls.machines.machine.index(null)],
        label: "Machines",
        url: urls.machines.index,
      },
      {
        highlight: [urls.devices.index, urls.devices.device.index(null)],
        label: "Devices",
        url: urls.devices.index,
      },
      {
        adminOnly: true,
        highlight: [
          urls.controllers.index,
          urls.controllers.controller.index(null),
        ],
        label: "Controllers",
        url: urls.controllers.index,
      },
    ],
  },
  {
    groupTitle: "KVM",
    groupIcon: "cluster-light",
    navLinks: [
      {
        label: "LXD",
        url: urls.kvm.lxd.index,
      },
      {
        label: "Virsh",
        url: urls.kvm.virsh.index,
      },
    ],
  },
  {
    groupTitle: "Networking",
    groupIcon: "connected-light",
    navLinks: [
      {
        highlight: [
          urls.subnets.index,
          urls.subnets.subnet.index(null),
          urls.subnets.space.index(null),
          urls.subnets.fabric.index(null),
          urls.subnets.vlan.index(null),
        ],
        label: "Subnets",
        url: urls.subnets.index,
      },
      {
        highlight: [urls.domains.index, urls.domains.details(null)],
        label: "DNS",
        url: urls.domains.index,
      },
      {
        label: "Network discovery",
        url: urls.dashboard.index,
      },
    ],
  },
];

const generateItems = ({
  authUser,
  groups,
  isAdmin,
  isAuthenticated,
  logout,
  path,
  showLinks,
  vaultIncomplete,
}: {
  authUser: User | null;
  groups: NavGroup[];
  isAdmin: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  path: string;
  showLinks: boolean;
  vaultIncomplete: boolean;
}) => {
  const items = [];

  if (showLinks) {
    groups.forEach((group) => {
      items.push(
        <>
          <div className="p-muted-heading" id={group.groupTitle}>
            {group.groupIcon ? <Icon light name={group.groupIcon} /> : null}
            {group.groupTitle}
          </div>
          <ul
            aria-labelledby={group.groupTitle}
            className="l-navigation__items"
          >
            {group.navLinks.map((navLink) => {
              if (!navLink.adminOnly || isAdmin) {
                return (
                  <li
                    aria-labelledby={navLink.label}
                    className={`l-navigation__item ${
                      isSelected(path, navLink) ? "is-selected" : null
                    }`}
                  >
                    {navLink.label === "Controllers" && vaultIncomplete ? (
                      // If Vault setup is incomplete (started but not finished), display a warning icon
                      <Icon
                        aria-label="warning"
                        className="p-navigation--item-icon"
                        data-testid="warning-icon"
                        name="security-warning-grey"
                      />
                    ) : null}
                    <Link
                      aria-current={
                        isSelected(path, navLink) ? "page" : undefined
                      }
                      className="l-navigation__link"
                      id={navLink.label}
                      to={navLink.url}
                    >
                      <span className="l-navigation__link-text">
                        {navLink.label}
                      </span>
                    </Link>
                  </li>
                );
              } else return null;
            })}
          </ul>
        </>
      );
    });
  }

  if (isAuthenticated) {
    items.push(
      <ul className="l-navigation__items">
        <hr />
        {isAdmin && showLinks ? (
          <>
            <li
              aria-labelledby="Settings"
              className={`l-navigation__item ${
                isSelected(path, {
                  label: "Settings",
                  url: urls.settings.index,
                })
                  ? "is-selected"
                  : null
              }`}
            >
              <Link
                aria-current={
                  isSelected(path, {
                    label: "Settings",
                    url: urls.settings.index,
                  })
                    ? "page"
                    : undefined
                }
                className="l-navigation__link"
                id="Settings"
                to={urls.settings.index}
              >
                <Icon light name="settings" />
                <span className="l-navigation__link-text">Settings</span>
              </Link>
            </li>
            <hr />
          </>
        ) : null}

        <li
          className={`l-navigation__item ${
            isSelected(path, { label: "", url: urls.preferences.index })
              ? "is-selected"
              : null
          }`}
        >
          <ContextualMenu
            aria-current={
              isSelected(path, { label: "", url: urls.preferences.index })
                ? "page"
                : undefined
            }
            aria-labelledby={authUser?.username}
            className="l-navigation__link is-dark"
            id={authUser?.username}
            position="right"
            toggleAppearance="link"
            toggleLabel={
              <>
                <Icon light name="profile-light" />
                <span className="l-navigation__link-text">
                  {authUser?.username}
                </span>
              </>
            }
          >
            <ul>
              <li>
                <Link to={urls.preferences.index}>Preferences</Link>
              </li>
              <li>
                <Button appearance="link" onClick={() => logout()}>
                  Log out
                </Button>
              </li>
            </ul>
          </ContextualMenu>
        </li>
        <hr />
      </ul>
    );
  }

  return items;
};

const GlobalSideNav = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const maasTheme = useSelector(configSelectors.theme);
  const configLoaded = useSelector(configSelectors.loaded);
  const { theme, setTheme } = useContext(ThemePreviewContext);
  const authUser = useSelector(authSelectors.get);
  const version = useSelector(versionSelectors.get);
  const maasName = useSelector(configSelectors.maasName);
  const isAdmin = useSelector(authSelectors.isAdmin);
  const path = location.pathname;
  const completedIntro = useCompletedIntro();
  const completedUserIntro = useCompletedUserIntro();
  const isAuthenticated = !!authUser;
  const introMatch = useMatch({ path: urls.intro.index, end: false });
  const isAtIntro = !!introMatch;
  const showLinks = isAuthenticated && completedIntro && completedUserIntro;
  useGoogleAnalytics();

  const logout = () => {
    localStorage.removeItem("maas-config");
    dispatch(statusActions.logout());
  };

  // Redirect to the intro pages if not completed.
  useEffect(() => {
    // Check that we're not already at the intro to allow navigation through the
    // intro pages. This is necessary beacuse this useEffect runs every time
    // there is a navigation change as the `navigate` function is regenerated
    // for every route change, see:
    // https://github.com/remix-run/react-router/issues/7634
    if (!isAtIntro && configLoaded) {
      if (!completedIntro) {
        navigate({ pathname: urls.intro.index }, { replace: true });
      } else if (isAuthenticated && !completedUserIntro) {
        navigate({ pathname: urls.intro.user }, { replace: true });
      }
    }
  }, [
    completedIntro,
    completedUserIntro,
    configLoaded,
    isAtIntro,
    isAuthenticated,
    navigate,
  ]);

  useEffect(() => {
    setTheme(maasTheme ? maasTheme : "default");
  }, [location, maasTheme, setTheme]);

  useEffect(() => {
    dispatch(controllerActions.fetch());
  }, [dispatch]);

  const { unconfiguredControllers, configuredControllers } = useSelector(
    (state: RootState) =>
      controllerSelectors.getVaultConfiguredControllers(state)
  );

  const vaultIncomplete =
    unconfiguredControllers.length >= 1 && configuredControllers.length >= 1;

  const [isCollapsed, setIsCollapsed] = useState(true);
  const themeColor = theme ? theme : maasTheme ? maasTheme : "default";

  return (
    <>
      <header className="l-navigation-bar">
        <div
          className={classNames(
            "p-panel is-dark",
            `l-navigation--${themeColor}`
          )}
        >
          <div className="p-panel__header">
            <div className="l-navigation__wrapper">
              <NavigationBanner />
            </div>
            <div className="p-panel__controls">
              <span
                className="p-panel__toggle js-menu-toggle"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                Menu
              </span>
            </div>
          </div>
        </div>
      </header>
      <nav
        className={classNames(
          `l-navigation is-pinned l-navigation--${themeColor}`,
          {
            "is-collapsed": isCollapsed,
          }
        )}
      >
        <div className="l-navigation__wrapper">
          <NavigationBanner />

          {generateItems({
            authUser,
            groups: navGroups,
            isAdmin,
            isAuthenticated,
            logout,
            path,
            showLinks,
            vaultIncomplete,
          })}
          {showLinks ? (
            <span id="maas-info">
              {maasName} MAAS v{version}
            </span>
          ) : null}
        </div>
      </nav>
    </>
  );
};

export default GlobalSideNav;
