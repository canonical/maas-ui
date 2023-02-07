import { useEffect, useContext, useState } from "react";

import { Icon } from "@canonical/react-components";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, useMatch } from "react-router-dom-v5-compat";

import AppSideNavItems from "./AppSideNavItems";
import NavigationBanner from "./NavigationBanner";
import type { NavGroup } from "./types";

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

const AppSideNavigation = (): JSX.Element => {
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
          <AppSideNavItems
            authUser={authUser}
            groups={navGroups}
            isAdmin={isAdmin}
            isAuthenticated={isAuthenticated}
            logout={logout}
            path={path}
            showLinks={showLinks}
            vaultIncomplete={vaultIncomplete}
          />
          {/* {generateItems({
            authUser,
            groups: navGroups,
            isAdmin,
            isAuthenticated,
            logout,
            path,
            showLinks,
            vaultIncomplete,
          })} */}
          {showLinks ? (
            <span id="maas-info">
              {maasName} MAAS v{version}
            </span>
          ) : null}
          <span
            className="l-navigation__toggle p-panel__toggle js-menu-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Icon light name="close" />
          </span>
        </div>
      </nav>
    </>
  );
};

export default AppSideNavigation;
