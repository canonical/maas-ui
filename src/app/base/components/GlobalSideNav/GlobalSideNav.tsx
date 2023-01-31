// import type { ReactNode } from "react";
import { useEffect, useContext } from "react";

// import type { NavLink } from "@canonical/react-components";
import { Button, ContextualMenu, Icon } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useNavigate,
  useLocation,
  matchPath,
  useMatch,
} from "react-router-dom-v5-compat";

import {
  useCompletedIntro,
  useCompletedUserIntro,
  //   useGoogleAnalytics,
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

type NavItem = {
  adminOnly?: boolean;
  highlight?: string | string[];
  label: string;
  url: string;
};

type NavGroup = {
  navLinks: NavItem[];
  groupTitle?: string;
  groupIcon?: string;
};

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
                      {navLink.label}
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
              <Icon light name="settings" />
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
                Settings
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
          <Icon light name="profile-light" />
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
            toggleLabel={authUser?.username}
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

const isSelected = (path: string, link: NavItem) => {
  // Use the provided highlight(s) or just use the url.
  let highlights = link.highlight || link.url;
  // If the provided highlights aren't an array then make them one so that we
  // can loop over them.
  if (!Array.isArray(highlights)) {
    highlights = [highlights];
  }
  // Check if one of the highlight urls matches the current path.
  return highlights.some((highlight) =>
    // Check the full path, for both legacy/new clients as sometimes the lists
    // are in one client and the details in the other.
    matchPath({ path: highlight, end: false }, path)
  );
};

const GlobalSideNav = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const maasTheme = useSelector(configSelectors.theme);
  const configLoaded = useSelector(configSelectors.loaded);
  const { theme, setTheme } = useContext(ThemePreviewContext);
  const authUser = useSelector(authSelectors.get);
  const isAdmin = useSelector(authSelectors.isAdmin);
  const version = useSelector(versionSelectors.get);
  const maasName = useSelector(configSelectors.maasName);
  const path = location.pathname;
  const completedIntro = useCompletedIntro();
  const completedUserIntro = useCompletedUserIntro();
  const isAuthenticated = !!authUser;
  const introMatch = useMatch({ path: urls.intro.index, end: false });
  const isAtIntro = !!introMatch;
  const showLinks = isAuthenticated && completedIntro && completedUserIntro;

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

  const homepageLink = isAdmin
    ? { url: urls.dashboard.index, label: "Homepage" }
    : { url: urls.machines.index, label: "Homepage" };

  return (
    <>
      <nav
        className={`l-navigation l-navigation--${
          theme ? theme : maasTheme ? maasTheme : "default"
        }`}
      >
        <div className="p-navigation__banner">
          <Link
            aria-current={isSelected(path, homepageLink) ? "page" : undefined}
            aria-label={homepageLink.label}
            className="l-navigation__logo-link"
            to={homepageLink.url}
          >
            <div className="p-navigation__tagged-logo">
              <div className="p-navigation__logo-tag">
                <svg
                  className="p-navigation__logo-icon"
                  fill="#fff"
                  viewBox="0 0 165.5 174.3"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <ellipse cx="15.57" cy="111.46" rx="13.44" ry="13.3" />
                  <path d="M156.94 101.45H31.88a18.91 18.91 0 0 1 .27 19.55c-.09.16-.2.31-.29.46h125.08a6 6 0 0 0 6.06-5.96v-8.06a6 6 0 0 0-6-6Z" />
                  <ellipse cx="15.62" cy="63.98" rx="13.44" ry="13.3" />
                  <path d="M156.94 53.77H31.79a18.94 18.94 0 0 1 .42 19.75l-.16.24h124.89a6 6 0 0 0 6.06-5.94v-8.06a6 6 0 0 0-6-6Z" />
                  <ellipse cx="16.79" cy="16.5" rx="13.44" ry="13.3" />
                  <path d="M156.94 6.5H33.1a19.15 19.15 0 0 1 2.21 5.11A18.82 18.82 0 0 1 33.42 26l-.29.46h123.81a6 6 0 0 0 6.06-5.9V12.5a6 6 0 0 0-6-6Z" />
                  <ellipse cx="15.57" cy="158.94" rx="13.44" ry="13.3" />
                  <path d="M156.94 149H31.88a18.88 18.88 0 0 1 .27 19.5c-.09.16-.19.31-.29.46h125.08A6 6 0 0 0 163 163v-8.06a6 6 0 0 0-6-6Z" />
                </svg>
              </div>
              <div className="p-navigation__logo-title">Canonical MAAS</div>
            </div>
          </Link>
        </div>
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
      </nav>
    </>
  );
};

export default GlobalSideNav;
