/* eslint-disable react/no-multi-comp */
import { useEffect, useContext, useState, useMemo } from "react";

import { Button } from "@canonical/react-components";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, useMatch } from "react-router-dom-v5-compat";

import AppSideNavCollapseToggle from "./AppSideNavCollapseToggle";
import AppSideNavItems from "./AppSideNavItems";
import NavigationBanner from "./NavigationBanner";
import { navGroups } from "./constants";

import {
  useCompletedIntro,
  useCompletedUserIntro,
  useGoogleAnalytics,
} from "app/base/hooks";
import { useGlobalKeyShortcut } from "app/base/hooks/base";
import ThemePreviewContext from "app/base/theme-preview-context";
import urls from "app/base/urls";
import authSelectors from "app/store/auth/selectors";
import configSelectors from "app/store/config/selectors";
import { actions as controllerActions } from "app/store/controller";
import controllerSelectors from "app/store/controller/selectors";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import type { RootState } from "app/store/root/types";
import { actions as statusActions } from "app/store/status";

const AppSideNavigation = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const maasTheme = useSelector(configSelectors.theme);
  const configLoaded = useSelector(configSelectors.loaded);
  const { theme, setTheme } = useContext(ThemePreviewContext);
  const authUser = useSelector(authSelectors.get);
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

  useEffect(() => {
    dispatch(podActions.fetch());
  }, [dispatch]);

  const virshKvms = useSelector(podSelectors.virsh);
  const kvmsLoaded = useSelector(podSelectors.loaded);
  const hasVirsh = virshKvms.length > 0;

  const { unconfiguredControllers, configuredControllers } = useSelector(
    (state: RootState) =>
      controllerSelectors.getVaultConfiguredControllers(state)
  );

  const vaultIncomplete =
    unconfiguredControllers.length >= 1 && configuredControllers.length >= 1;

  const [isCollapsed, setIsCollapsed] = useState(true);
  useGlobalKeyShortcut("[", () => {
    setIsCollapsed(!isCollapsed);
  });
  const themeColor = theme ? theme : maasTheme ? maasTheme : "default";

  const filteredGroups = useMemo(() => {
    if (hasVirsh === false && kvmsLoaded) {
      const kvmGroupIndex = navGroups.findIndex(
        (group) => group.groupTitle === "KVM"
      );

      const virshItemIndex = navGroups[kvmGroupIndex].navLinks.findIndex(
        (navLink) => navLink.label === "Virsh"
      );

      if (virshItemIndex > -1) {
        navGroups[kvmGroupIndex].navLinks.splice(virshItemIndex, 1);
      }
    }

    return navGroups;
  }, [hasVirsh]);

  return (
    <>
      <header className="l-navigation-bar">
        <div className={classNames("p-panel is-dark", `is-maas-${themeColor}`)}>
          <div className="p-panel__header">
            <NavigationBanner />
            <div className="p-panel__controls u-nudge-down--small u-no-margin--top u-hide--large">
              <Button
                appearance="base"
                className="has-icon is-dark"
                onClick={() => {
                  setIsCollapsed(!isCollapsed);
                }}
              >
                Menu
              </Button>
            </div>
          </div>
        </div>
      </header>
      <nav
        aria-label="main navigation"
        className={classNames(`l-navigation is-maas-${themeColor}`, {
          "is-collapsed": isCollapsed,
          "is-pinned": !isCollapsed,
        })}
      >
        <div className="l-navigation__drawer">
          <div className="p-panel is-dark">
            <div className={`p-panel__header is-sticky is-maas-${themeColor}`}>
              <NavigationBanner>
                <div className="l-navigation__controls">
                  <AppSideNavCollapseToggle
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                  />
                </div>
              </NavigationBanner>
            </div>
            <div className="p-panel__content">
              <div className="p-side-navigation--icons is-dark">
                <AppSideNavItems
                  authUser={authUser}
                  groups={filteredGroups}
                  isAdmin={isAdmin}
                  isAuthenticated={isAuthenticated}
                  logout={logout}
                  path={path}
                  showLinks={showLinks}
                  vaultIncomplete={vaultIncomplete}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="l-navigation-expand">
        <AppSideNavCollapseToggle
          className={`is-maas-${themeColor}`}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>
    </>
  );
};

export default AppSideNavigation;
